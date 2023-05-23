import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SynchronizationProcessesService } from '../../synchronization-processes/synchronization-processes.service';
import {
  Synchronization,
  SynchronizationDocument,
} from '../synchronization.schema';
import { CreateSynchronizationDto } from '../dto/create-synchronization.dto';
import { SynchronizeDto } from '../dto/synchronize.dto';
import { ApiSynchronizationService } from './api-synchronization.service';
import { DatabaseSynchronizationService } from './database-synchronization.service';
import { SynchronizationSource } from '../enums/synchronization-source.enum';
import { ImapSynchronizationService } from './imap-synchronization.service';
import { SynchronizationProcessDocument } from 'src/modules/synchronization-processes/synchronization-process.schema';
import { SynchronizationProcessStatus } from 'src/modules/synchronization-processes/enums/syncronizationProcessStatus.enum';

const MAX_ATTEMPTS = 5;
const ATTEMPT_DELAY = 5000;

@Injectable()
export class SynchronizationsService {
  constructor(
    @InjectModel(Synchronization.name)
    private synchronizationModel: Model<Synchronization>,
    private synchronizationProcessesService: SynchronizationProcessesService,
    private databaseSynchronizationService: DatabaseSynchronizationService,
    private apiSynchronizationService: ApiSynchronizationService,
    private imapSynchronizationService: ImapSynchronizationService,
  ) {}

  async create(createSynchronizationDto: CreateSynchronizationDto) {
    return await this.synchronizationModel.create(createSynchronizationDto);
  }

  async synchronize(synchronizeDto: SynchronizeDto) {
    const { retry } = synchronizeDto;
    const { synchronization, synchronizationProcess } =
      await this.getSynchronizationAndProcess(synchronizeDto);

    if (retry) {
      await synchronizationProcess.updateOne({ attempts: 1 });
    }

    try {
      await this.run(synchronization, synchronizationProcess);
    } catch (error) {
      await this.catchError(error, synchronization, synchronizationProcess);
    }
  }

  private async getSynchronizationAndProcess(synchronizeDto: SynchronizeDto) {
    const { synchronizationId, synchronizationProcessId } = synchronizeDto;
    let synchronization;
    let synchronizationProcess;

    //start
    if (!synchronizationProcessId) {
      synchronization = await this.synchronizationModel
        .findById(synchronizationId)
        .populate({ path: 'fields.feature' });
      synchronizationProcess =
        await this.synchronizationProcessesService.create({
          synchronization: synchronization._id,
        });
      // reload
    } else {
      synchronizationProcess =
        await this.synchronizationProcessesService.findById(
          synchronizationProcessId,
        );
      synchronization = await this.synchronizationModel
        .findById(synchronizationProcess.synchronization)
        .populate({ path: 'fields.feature' });
    }

    return { synchronization, synchronizationProcess };
  }

  private async run(
    synchronization: SynchronizationDocument,
    synchronizationProcess: SynchronizationProcessDocument,
  ) {
    switch (synchronization.source) {
      case SynchronizationSource.POSTGRESQL:
        await this.databaseSynchronizationService.synchronize(
          synchronization,
          synchronizationProcess,
        );
        break;
      case SynchronizationSource.API:
        await this.apiSynchronizationService.synchronize(
          synchronization,
          synchronizationProcess,
        );
        break;
      case SynchronizationSource.IMAP:
        await this.imapSynchronizationService.synchronize(
          synchronization,
          synchronizationProcess,
        );
        break;
      default:
        break;
    }
  }

  private async catchError(
    error: Error,
    synchronization: SynchronizationDocument,
    synchronizationProcess: SynchronizationProcessDocument,
  ) {
    if (synchronizationProcess.attempts !== MAX_ATTEMPTS) {
      await synchronizationProcess.updateOne({ $inc: { attempts: 1 } });
      await this.sleep();
      return await this.synchronize({
        synchronizationId: synchronization._id,
        synchronizationProcessId: synchronizationProcess._id,
      });
    } else {
      await synchronizationProcess.updateOne({
        status: SynchronizationProcessStatus.FAILED,
        errorMessage: error.message,
      });
    }
  }

  async sleep() {
    return await new Promise((resolve) => {
      setTimeout(() => resolve(true), ATTEMPT_DELAY);
    });
  }
}
