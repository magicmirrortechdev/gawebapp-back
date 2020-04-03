'use strict';

const amqp = require('amqplib/callback_api');
const Ably = require('ably');

/* Start the worker that consumes from the AMQP QUEUE */
exports.start = function(apiKey, channelName, queueName, queueEndpoint) {
    const appId = apiKey.split('.')[0]; /* API Keys are in format appId.keyId:secret */
    const queue = appId + ":" + queueName;
    const endpoint = queueEndpoint;
    const url = 'amqps://' + apiKey + '@' + endpoint;
    const rest = new Ably.Rest({ key: apiKey });

    console.log("ably ", apiKey, channelName, queue, queueEndpoint);

    amqp.connect(url, (err, conn) => {
        if (err) {
            return console.error('worker:', 'Queue error!', err);
        }

        /* Create a communication channel */
        conn.createChannel((err, ch) => {
            if (err) {
                return console.error('worker:', 'Queue error!', err);
            }

            ch.consume(queue, (item) => {
                const decodedEnvelope = JSON.parse(item.content);
                const messages = Ably.Realtime.Message.fromEncodedArray(decodedEnvelope.messages);
                messages.forEach((message) => {
                    console.log("estado del pago ", message.data);
                    //actualizar el pago llega un JSON con los siguientes datos
                    /*
                    {
                    "jobId":"5e32179a3aa1cc44ff661edb",
                    "workerId":"5e29d23597b3114f659141c8",
                    "invoiceId":"5e837253b3c2cc77e84283e7",
                    "status": success / fail
                    "chargeId": "5e837253d5eb211d2f501a7a"
                    "amount": 00.00 // cantidad pagada
                    }
                     */
                });
                ch.ack(item);
            });
        });

        conn.on('error', (err) => { console.error('worker:', 'Connection error!', err); });
    });
};