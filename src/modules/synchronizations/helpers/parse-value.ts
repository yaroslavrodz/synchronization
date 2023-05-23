import { FeatureType } from 'src/modules/features/enums/feature-type.enum';
import { FeatureDocument } from 'src/modules/features/feature.schema';

export function parseValue(feature: FeatureDocument, value: any) {
  try {
    let parsedValue;
    switch (feature.type) {
      case FeatureType.STRING:
        parsedValue = String(value);
        break;
      case FeatureType.NUMBER:
        parsedValue = Number(value);
        break;
      case FeatureType.DATE:
        parsedValue = new Date(value);
        break;
      default:
        break;
    }
    return parsedValue;
  } catch (error) {
    throw new Error('Cannot parse value for record');
  }
}
