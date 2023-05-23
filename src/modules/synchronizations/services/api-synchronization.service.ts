import { Injectable } from '@nestjs/common';

import { DatasetsService } from '../../datasets/datasets.service';
import { RecordsService } from '../../records/records.service';
import { SynchronizationDocument } from '../synchronization.schema';
import { SynchronizationProcessDocument } from '../../synchronization-processes/synchronization-process.schema';
import { CreateDatasetDto } from '../../datasets/dto/create-dataset.dto';
import { SynchronizationProcessStatus } from '../../synchronization-processes/enums/syncronizationProcessStatus.enum';
import { transformDatasets } from '../helpers/transform-datasets';
import axios from 'axios';

const LIMIT = 100;

@Injectable()
export class ApiSynchronizationService {
  constructor(
    private datasetsService: DatasetsService,
    private recordsService: RecordsService,
  ) {}

  async synchronize(
    synchronization: SynchronizationDocument,
    synchronizationProcess: SynchronizationProcessDocument,
  ) {
    try {
      const idColumn = synchronization.api.idColumn;
      const config = {
        method: synchronization.api.method,
        url: synchronization.api.url,
        headers: synchronization.api.headers,
        params: synchronization.api.params,
        data: synchronization.api.body,
      };
      const data = await axios(config);
      const sourceDatasets = data.data as object[];
      await synchronizationProcess.updateOne({
        datasetsCount: sourceDatasets.length,
      });

      let offset = synchronizationProcess.processedDatasetsCount;
      for (; offset < sourceDatasets.length; offset += LIMIT) {
        const sourceSubsets = sourceDatasets.slice(offset, offset + LIMIT);

        const datasets = await transformDatasets(
          synchronization,
          synchronizationProcess,
          sourceSubsets,
          idColumn,
        );

        await this.insertDatasets(datasets);

        await synchronizationProcess.updateOne({
          attempts: 1,
          $inc: {
            processedDatasetsCount: sourceSubsets.length,
            transferedDatasetsCount: datasets.length,
          },
        });
      }

      await synchronizationProcess.updateOne({
        status: SynchronizationProcessStatus.COMPLETED,
        errorMessage: null,
      });
    } catch (error) {
      throw error;
    }
  }

  private async insertDatasets(datasets: CreateDatasetDto[]) {
    try {
      await Promise.all(
        datasets.map(async (datasetDto) => {
          const dataset = await this.datasetsService.findBySourceDatasetId(
            datasetDto.sourceDatasetId,
          );

          if (!dataset) {
            await this.datasetsService.create(datasetDto);
          } else {
            const records = datasetDto.records.map((record) => {
              return {
                ...record,
                dataset: dataset._id,
              };
            });
            await this.recordsService.archiveRecords(dataset._id);
            await this.recordsService.createMany(records);
          }
        }),
      );
    } catch (error) {
      throw new Error('Error while insert');
    }
  }
}
