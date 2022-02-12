require("dotenv").config();
const nodemailer = require("nodemailer");

const smtpTransport = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  auth: {
    user: process.env.SENDINBLUE_LOGIN,
    pass: process.env.SENDINBLUE_PASS,
  },
});

async function sendConfirmationMail(email, token) {
  let sendResult = await smtpTransport.sendMail({
    from: "Agadir pet finder <agadirpetfinder@griitch.io",
    to: email,
    subject: "Confirmation de publication d'annonce",
    html: `
            <body>
            <h1>Agadir pet finder</h1>
            <hr>
                <p>Pour confirmer votre annonce, entrez ce code :
                <strong> ${token} </strong> dans le champ spécifié sur 
                <a href="http://localhost:8080/confirmPost">localhost:8080/confirmPost</a>
                </p>
                <p>Ce code vous sera demandé si vous souhaitez supprimer l'annonce, donc pensez
                à ne pas supprimer cet email tant que vous voulez guarder l'annonce en ligne</p>
            </body>
        `,
  });
  console.log(sendResult);
}

module.exports = sendConfirmationMail;
