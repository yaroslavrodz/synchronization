import { CreateRecordDto } from 'src/modules/records/dto/create-record.dto';
import { Field } from '../sub-schemas/filed.schema';
import { parseValue } from './parse-value';

export function transformRecords(fields: Field[], sourceDataset: object) {
  try {
    const records: Omit<CreateRecordDto, 'dataset'>[] = [];
    fields.forEach(({ feature, source, required }) => {
      const value = sourceDataset[source];

      if (!required && value === null) {
        return;
      } else if (required && value === null) {
        throw new Error('Missing required value for record');
      } else {
        const parsedValue = parseValue(feature, value);

        records.push({
          value: parsedValue,
          feature: feature._id,
        });
      }
    });
    return records;
  } catch (error) {
    throw error;
  }
}
