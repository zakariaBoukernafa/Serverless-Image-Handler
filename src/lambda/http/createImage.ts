import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

const docClient = new AWS.DynamoDB.DocumentClient()

const s3 =new AWS.S3({
    signatureVersion :'V4'
})

const groupsTable = process.env.GROUPS_TABLE
const imagesTable = process.env.IMAGES_TABLE
const bucketName  = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('caller event: ', event)
  const groupId =event.pathParameters.groupId
  const validGroupId= await groupExists(groupId)

  if(!validGroupId){
    return{
        statusCode:404,
        headers:{
            'Access-Control-Allow-origin': '*'
    },
    body: JSON.stringify({
        error: 'Group does not exist'
        
    })
    
    }

  }
  const imageId =uuid.v4()
  const newItem = await createImage(groupId,imageId,event)
  const url = getUploadUrl(imageId)
 

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body:JSON.stringify({
        newItem:newItem,
        uploadUrl:url

    })
  }
}


async function createImage(groupId:string ,imageId:string,event:any){
    const timeStamp = new Date().toISOString()
    const newImage = JSON.parse(event.body)
    const newItem={
        groupId,
        timeStamp,
        imageId,
        ...newImage,
        imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
    }
    console.log('storing new item :',newItem)
    await docClient.put({
        TableName:imagesTable,
        Item :newItem
    }).promise(
    )
    
    return newItem

}

async function groupExists(groupId:string){
    const result =await docClient.get({
        TableName:groupsTable,
        Key:{
            id:groupId
        }
    }).promise()
    console.log('Get group:',result)
    return !!result.Item

}
 function getUploadUrl(imageId:string){
    return s3.getSignedUrl('putObject',{
        Bucket:bucketName,
        Key: imageId,
        Expires: urlExpiration
    })

}