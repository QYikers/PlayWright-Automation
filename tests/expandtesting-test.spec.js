const {test, expect} = require('@playwright/test');

test.describe('Expand Site testing',()=>{
    const baseAPIurl='https://practice.expandtesting.com/notes/api';

    let authToken;
    test('Register using API',async({request})=>{
        const uniqueEmail = `testuser_${Date.now()}@example.com`;
        const response = await request.post(`${baseAPIurl}/users/register`,{

           
            data:{
                name:'TestUser',
                email:uniqueEmail,
                password:'TestPassword'
            }
        })

        expect(response.status()).toBe(201);

        const checker = await response.json();
        console.log(checker);
        console.log(checker.data.name);
        console.log(checker.data.email);
        console.log(checker.data.password);

    })
    /** Credentials
    name: 'TestUser',
    email: 'testuser_1767533699274@example.com',
    password: 'TestPassword'
     **/
     test('Login Using API', async ({request})=>{
        const response = await request.post(`${baseAPIurl}/users/login`,{
            data:{
                email:'testuser_1767533699274@example.com',
                password:'TestPassword'
            }
        })

        const checker = await response.json();
       await expect(checker.status).toBe(200);
        ;
        });

    test('Insert Notes using API', async({request})=>{
        
        const responseLogin = await request.post(`${baseAPIurl}/users/login`,{
            data:{
                email:'testuser_1767533699274@example.com',
                password:'TestPassword'
            }
        })
        const tokenData = await responseLogin.json();
        authToken = tokenData.data.token;

        const response = await request.post(`${baseAPIurl}/notes`,{
            headers:{
                'x-auth-token': authToken
            },
            data:{
                title:'Test Note',
                description:'This note is created using Playwright Automation',
                category:'Personal'
            }

        })
        const checker = await response.json();
      await expect(checker.status).toBe(200);
        console.log(checker.data);
    })
})