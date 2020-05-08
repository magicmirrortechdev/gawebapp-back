'use strict';

const amqp = require('amqplib/callback_api');
const Ably = require('ably');
const Estimate = require('../models/Estimate')

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
                    console.log("estado del pago ", message);
                    console.log("", message.data.response);
                    //actualizar el pago llega un JSON con los siguientes datos

                    const query = {
                        invoices: {
                            $elemMatch: { _id: message.data.response.invoiceId }
                        }
                    }
                    Estimate.findOneAndUpdate(query, {
                            query,
                            $push: {
                                "invoices.$.payment": {
                                    paid: message.data.response.amount ? message.data.response.amount : 0,
                                    date: message.data.response.date,
                                    argyleChargeId: message.data.response.chargeId,
                                    argyleChargeUrl: message.data.response.recipient,
                                    argyleStatus: message.data.response.status,
                                }
                            }
                        }, { new: true })
                        .then(estimate => {
                            console.log("creado");
                        })
                        .catch(err => {
                            console.log(err);
                        });
                });
                ch.ack(item);
            });
        });

        conn.on('error', (err) => { console.error('worker:', 'Connection error!', err); });
    });
};