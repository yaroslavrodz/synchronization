import * as Imap from 'imap';
import { Config as ImapConfig } from 'imap';
import { simpleParser } from 'mailparser';
import { CreateEmailDto } from 'src/modules/emails/dto/create-email.dto';

export class IMAPService {
  private imap: Imap;

  constructor(config: ImapConfig) {
    this.imap = new Imap(config);
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.imap.connect();
      this.imap.once('ready', resolve);
      this.imap.once('error', reject);
    });
  }

  disconnect() {
    this.imap.end();
  }

  async receiveEmails(): Promise<string[]> {
    const rawEmails = [];
    return new Promise((resolve, reject) => {
      this.imap.openBox('INBOX', true, (err) => {
        if (err) reject(err);

        const fetch = this.imap.seq.fetch('1:*', { bodies: '' });

        fetch.on('message', async (msg) => {
          let rawEmail = '';
          msg.on('body', (stream) => {
            stream.on('data', (chunk) => {
              rawEmail += chunk.toString('utf8');
            });
          });

          msg.on('end', async () => {
            rawEmails.push(rawEmail);
          });
        });
        fetch.once('end', async () => {
          this.imap.end();
          resolve(rawEmails);
        });
      });
    });
  }

  async parseEmails(
    rawEmails: string[],
  ): Promise<Omit<CreateEmailDto, 'synchronization'>[]> {
    try {
      const parsedEmails = await Promise.all(
        rawEmails.map(async (rawEmail) => {
          const parsedEmail = await simpleParser(rawEmail);
          const to = [];
          if (Array.isArray(parsedEmail.to)) {
            parsedEmail.to.forEach((addressObject) => {
              addressObject.value.forEach((emailAddress) => {
                to.push(emailAddress.address);
              });
            });
          } else {
            parsedEmail.to.value.forEach((emailAddress) => {
              to.push(emailAddress.address);
            });
          }
          return {
            from: parsedEmail.from.value[0].address,
            to,
            subject: parsedEmail.subject,
            text: parsedEmail.text,
            html: parsedEmail.html,
            date: parsedEmail.date,
          };
        }),
      );
      return parsedEmails as Omit<CreateEmailDto, 'synchronization'>[];
    } catch (error) {
      throw error;
    }
  }
}
