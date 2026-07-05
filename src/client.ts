import axios from 'axios';

async function testOptionsDiscovery() {

    console.log('CHECKING OPTIONS Discovery...');

    const res = await axios({
        method: 'options',
        url: "http://localhost:3000/users",
    })

    console.log('Allow headers: ', res.headers['allow'])
    console.log('Accept-Query header: ', res.headers['accept-query'])
}

async function testQuery() {

    console.log('SENDING QUERY Request...')

    try {
        

        const res = await axios({
            method: 'query',
            url: 'http://localhost:3000/users',
            data: {
                role: 'admin',
                sort: 'name'
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })

        console.log('Status: ', res.status);
        console.log('Data: ', res.data);
    } catch (err) {
        if(axios.isAxiosError(err)){
            console.error('Axios error: ', err.message)
            if(err.response){
                console.log('Response Status: ', err.response.status)
                console.error('Response data: ', err.response.data)
            } else {
                console.error('No response received, method might fail')
            }
        } else {
            console.error('Unexpected Error: ',err)
        }
    }
}

async function main() {
  await testOptionsDiscovery()
  await testQuery()
}

main()