const {test, expect} = require('@playwright/test');

test.describe('Expand Site testing',()=>{
    const baseAPIurl='https://practice.expandtesting.com/notes/api';
    let authToken;

    // Test for getting the auth token
    test.beforeAll(async({request})=>{
        const response = await request.post(`${baseAPIurl}/users/login`,{
            data:{
                email:process.env.USER_EMAIL,
                password:process.env.USER_PASSWORD
            }
        })
        const tokenData = await response.json();
        authToken = tokenData.data.token;
    })

    /** Credentials
    name: 'TestUser',
    email: 'testuser_1767533699274@example.com',
    password: 'TestPassword'
     **/
    test('Login Using API', async ({request})=>{
        const response = await request.post(`${baseAPIurl}/users/login`,{
            data:{
                email:process.env.USER_EMAIL,
                password:process.env.USER_PASSWORD
            }
        })

        const checker = await response.json();
       await expect(checker.status).toBe(200);
        ;
        });

    test('Insert Notes using API', async({request})=>{
        

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

    test('Deleting of All of the Notes using API', async({request})=>{
        const idArray=[];
        const response = await request.get(`${baseAPIurl}/notes`,{
            headers:{
                'x-auth-token':authToken
            }
        })
        const responseData = await response.json();
        responseData.data.forEach(note => {
            console.log(note.id);
            idArray.push(note.id);
        });
         for (const id of idArray){
            const deleteApi = await request.delete(`${baseAPIurl}/notes/${id}`,{
                headers:{
                    'x-auth-token':authToken
                }
            })
            const responseBody = await deleteApi.json();
            console.log(responseBody.status);
            await expect(deleteApi.status()).toBe(200);
         }
       

    })

})

test.describe('Negative Testing in Expand Testing',()=>{

     const baseAPIurl='https://practice.expandtesting.com/notes/api';
    let authToken;

    // Test for getting the auth token
    test.beforeAll(async({request})=>{
        const response = await request.post(`${baseAPIurl}/users/login`,{
            data:{
                email:process.env.USER_EMAIL,
                password:process.env.USER_PASSWORD
            }
        })
        const tokenData = await response.json();
        authToken = tokenData.data.token;
    })



    test('Login Using API with Invalid Credentials', async({request})=>{
        const response = await request.post(`${baseAPIurl}/users/login`,{
            data:{
                email:'InvalidEmail@example.com',
                password:'InvalidPassword'
            }
        })
        const checker = await response.json();
        await expect(checker.status).toBe(401);
    })


    test('Adding notes Using API with Invalid/Expired Token',async({request})=>{
        const response =await request.post(`${baseAPIurl}/notes`,{
            headers:{
                'x-auth-token':'InvalidToken'
            },
            data:{
                title:'Test Note',
                description:'This note is created using Playwright Automation',
                category:'Personal'
            }
        })
        const checker = await response.json();
        await expect(checker.status).toBe(401);
    })

})
