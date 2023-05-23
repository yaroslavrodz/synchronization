import { SynchronizationProcessDocument } from 'src/modules/synchronization-processes/synchronization-process.schema';
import { SynchronizationDocument } from '../synchronization.schema';
import { CreateDatasetDto } from 'src/modules/datasets/dto/create-dataset.dto';
import { transformRecords } from './transform-records';

export async function transformDatasets(
  synchronization: SynchronizationDocument,
  synchronizationProcess: SynchronizationProcessDocument,
  sourceDatasets: object[],
  idColumn: string,
) {
  const unitId = synchronization.unit._id;
  const synchronizationId = synchronization._id;
  const fields = synchronization.fields;

  const datasets: CreateDatasetDto[] = [];
  sourceDatasets.forEach(async (sourceDataset) => {
    try {
      const sourceDatasetId = sourceDataset[idColumn];
      if (sourceDatasetId === null) {
        throw new Error('The id field contains a null value');
      }

      const records = transformRecords(fields, sourceDataset);

      datasets.push({
        unit: unitId,
        synchronization: synchronizationId,
        sourceDatasetId: sourceDatasetId,
        records,
      });
    } catch (error) {
      await synchronizationProcess.updateOne({
        $push: {
          log: `Cannot parse dataset: '${JSON.stringify(
            sourceDataset,
          )}', Error: '${error}'`,
        },
      });
    }
  });

  return datasets;
}
