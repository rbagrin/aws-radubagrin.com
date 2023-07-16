

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const data = [{
        title: 'Not afraid',
        author: 'Eminem',
        path: 'https://aswradubagrincom-bucket153651-staging.s3.eu-west-2.amazonaws.com/public/music/not-afraid.mp3'
    },
    {
        title: 'Changes',
        author: '2pac',
        path: 's3://aswradubagrincom-bucket153651-staging/public/music/changes-ft-talent.mp3'
    }]
    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(data),
    };
};
