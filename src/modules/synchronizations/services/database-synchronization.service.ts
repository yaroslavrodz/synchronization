import { Injectable } from '@nestjs/common';

import { DatasetsService } from '../../datasets/datasets.service';
import { RecordsService } from '../../records/records.service';
import { PostgreSQLService } from 'src/services/postgresql/postgresql.service';
import {
  buildSelectTableDataQuery,
  buildSelectTableDataCountQuery,
} from 'src/services/postgresql/postgresql-query.builder';
import { SynchronizationDocument } from '../synchronization.schema';
import { SynchronizationProcessDocument } from '../../synchronization-processes/synchronization-process.schema';
import { Field } from '../sub-schemas/filed.schema';
import { CreateDatasetDto } from '../../datasets/dto/create-dataset.dto';
import { SynchronizationProcessStatus } from '../../synchronization-processes/enums/syncronizationProcessStatus.enum';
import { transformDatasets } from '../helpers/transform-datasets';

const LIMIT = 100;

@Injectable()
export class DatabaseSynchronizationService {
  constructor(
    private datasetsService: DatasetsService,
    private recordsService: RecordsService,
  ) {}

  async synchronize(
    synchronization: SynchronizationDocument,
    synchronizationProcess: SynchronizationProcessDocument,
  ) {
    try {
      const databaseConfig = synchronization.database.config;
      const table = synchronization.database.table.name;
      const idColumn = synchronization.database.table.idColumn;
      const fields = synchronization.fields;
      const requestedFields = this.createRequestedFields(fields, idColumn);

      const postgreSQLService = new PostgreSQLService(databaseConfig);
      const countQuery = buildSelectTableDataCountQuery(table);
      const datasetsCount = await postgreSQLService.queryCount(countQuery);
      await synchronizationProcess.updateOne({ datasetsCount });

      let offset = synchronizationProcess.processedDatasetsCount;
      for (; offset < datasetsCount; offset += LIMIT) {
        const rowsQuery = buildSelectTableDataQuery(
          table,
          requestedFields,
          LIMIT,
          offset,
        );
        const sourceDatasets = await postgreSQLService.queryRows(rowsQuery);

        const datasets = await transformDatasets(
          synchronization,
          synchronizationProcess,
          sourceDatasets,
          idColumn,
        );

        await this.insertDatasets(datasets);

        await synchronizationProcess.updateOne({
          attempts: 1,
          $inc: {
            processedDatasetsCount: sourceDatasets.length,
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

  createRequestedFields(fields: Field[], idColumn: string) {
    const requestedFields = fields.map(({ source }) => source);
    if (!requestedFields.includes(idColumn)) {
      requestedFields.push(idColumn);
    }
    return requestedFields;
  }

  async insertDatasets(datasets: CreateDatasetDto[]) {
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
