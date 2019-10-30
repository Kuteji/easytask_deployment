const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');



let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});


    // generar HTML
    const generarHTML = (archivo, options = {} ) => {
        const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, options);
        return juice(html);
    }
   

exports.enviar = async (options) => {
    const html = generarHTML(options.archivo, options);
    const text = htmlToText.fromString(html)
    let optionsEmail = {
        
        from: 'EasyTask 👻 <no-reply@easytask.com>', // sender address
        to: options.usuario.email, // list of receivers
        subject: options.subject + '✔', // Subject line
        text,
        html
    };

    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, optionsEmail);
}





