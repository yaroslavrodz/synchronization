import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { SynchronizationDocument } from '../synchronization.schema';
import { SynchronizationProcessDocument } from '../../synchronization-processes/synchronization-process.schema';
import { SynchronizationProcessStatus } from '../../synchronization-processes/enums/syncronizationProcessStatus.enum';
import { IMAPService } from 'src/services/imap/imap.service';
import { CreateEmailDto } from 'src/modules/emails/dto/create-email.dto';
import { EmailsService } from 'src/modules/emails/emails.service';

const LIMIT = 100;

@Injectable()
export class ImapSynchronizationService {
  constructor(private emailsService: EmailsService) {}

  async synchronize(
    synchronization: SynchronizationDocument,
    synchronizationProcess: SynchronizationProcessDocument,
  ) {
    try {
      const imapConfig = synchronization.imap.config;
      const imapService = new IMAPService(imapConfig);
      await imapService.connect();
      const rawEmails = await imapService.receiveEmails();
      const parsedEmails = await imapService.parseEmails(rawEmails);

      await synchronizationProcess.updateOne({
        datasetsCount: parsedEmails.length,
      });
      await this.emailsService.deleteBySynchronization(synchronization._id);

      let offset = synchronizationProcess.processedDatasetsCount;
      for (; offset < parsedEmails.length; offset += LIMIT) {
        const subEmails = parsedEmails.slice(offset, offset + LIMIT);

        await this.insertEmails(subEmails, synchronization._id);
        await synchronizationProcess.updateOne({
          attempts: 1,
          $inc: {
            processedDatasetsCount: parsedEmails.length,
            transferedDatasetsCount: parsedEmails.length,
          },
        });
      }

      imapService.disconnect();
      await synchronizationProcess.updateOne({
        status: SynchronizationProcessStatus.COMPLETED,
        errorMessage: null,
      });
    } catch (error) {
      throw error;
    }
  }

  private async insertEmails(
    emails: Omit<CreateEmailDto, 'synchronization'>[],
    synchronization: Types.ObjectId,
  ) {
    try {
      const emailsDto: CreateEmailDto[] = emails.map((email) => {
        return {
          ...email,
          synchronization,
        };
      });

      await this.emailsService.createMany(emailsDto);
    } catch (error) {
      throw new Error('Error while insert');
    }
  }
}
