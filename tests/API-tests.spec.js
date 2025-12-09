const {test, expect} = require('@playwright/test');

test.describe("API Test", ()=>{

    test('HeroKuapp API Test',async ({request})=>{

        const response = await request.get('https://restful-booker.herokuapp.com/booking',{
            data:{
                firstname:"Hero",
                lastname:"Kuapp",
                totalprice:150,
                depositpaid:true,
                bookingdates:{
                    checkin:"2026-01-01",checkout:"2026-01-10"},
                addtionalneeds:"GameStation5"
                
            }
         });
         await expect(response.status()).toEqual(200);

    });

});