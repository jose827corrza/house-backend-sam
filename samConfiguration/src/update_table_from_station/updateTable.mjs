// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidV4 } from 'uuid'
const client = new DynamoDBClient({});

const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const putItemHandler = async (event) => {

    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Get id and name from the body of the request
    const id = uuidV4()
    const eventString = JSON.stringify(event)
    const body = JSON.parse(eventString);

  //   {
  //     "device": "rpi-master",
  //     "mode": "STATION",
  //     "signal": null,
  //     "data": {
  //         "pressure": {
  //             "value": "1023",
  //             "magnitude": "Pa"
  //         },
  //         "humidity": {
  //             "value": "80",
  //             "magnitude": "%"
  //         }
  //     }
  // }

    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    var params = {
        TableName : tableName,
        Item: { 
          id : id,
          pressure_val: body.data.pressure.value, 
          pressure_mag: body.data.pressure.magnitude, 
          humidity_val: body.data.humidity.value,
          humidity_mag: body.data.humidity.magnitude 
         }
    };

    // var paramsIot = {
    //     topic: "topic_2",
    //     payload: JSON.stringify(event),
    //     qos: 0
    // };

    try {
        const data = await ddbDocClient.send(new PutCommand(params));


        console.log("Success - item added or updated", data);
      } catch (err) {
        console.log("Error", err.stack);
      }

    const response = {
        statusCode: 200,
        body: "body"
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};