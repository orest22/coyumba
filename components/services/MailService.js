let nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');

class MailService {
    constructor(options) {
        const transport = mailgunTransport(options);
        this.emailClient = nodemailer.createTransport(transport);
    }

    /**
     * Send email
     * @param {String} to Email address
     * @param {String} subject Email subject
     * @param {String} text Email content
     * @returns {Promise}
     */
    sendText(to, subject, text) {
        return new Promise((resolve, reject) => {
            this.emailClient.sendMail({
                from: '"Yumba Bot" <orest@crowdlinker.com>',
                to,
                subject,
                text,
              }, (err, info) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(info);
                }
              });
        });
    }
}

module.exports = MailService;
