import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";



export async function getResults(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('getResults function processed a request');

    try {
     
        

      
        const startDate = request.query.get('startDate');
        const endDate = request.query.get('endDate');
        const gameTypes = request.query.get('gameTypes');
        const offset = parseInt(request.query.get('offset') || '0');
        const count = parseInt(request.query.get('count') || '30');
        const useCache = request.query.get('useCache') === 'true';
        const forceRefresh = request.query.get('forceRefresh') === 'true';

      
        let requestBody: any = {};
        if (request.method === 'POST') {
            try {
                requestBody = await request.json() as any;
            } catch {
                
            }
        }

  
        const finalStartDate = requestBody.startDate || startDate;
        const finalEndDate = requestBody.endDate || endDate;
        const finalGameTypes = requestBody.gameTypes || gameTypes;
        const finalOffset = requestBody.offset || offset;
        const finalCount = requestBody.count || count;
        const finalUseCache = requestBody.useCache !== undefined ? requestBody.useCache : useCache;
        const finalForceRefresh = requestBody.forceRefresh !== undefined ? requestBody.forceRefresh : forceRefresh;

        
        let startTs: number;
        let finishTs: number;

        if (finalStartDate && finalEndDate) {
            startTs = Math.floor(new Date(finalStartDate).getTime() / 1000);
            finishTs = Math.floor(new Date(finalEndDate).getTime() / 1000);
        } else {
        
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
            
            startTs = Math.floor(startOfDay.getTime() / 1000);
            finishTs = Math.floor(endOfDay.getTime() / 1000);
        }

    
        const gameTypesArray = finalGameTypes ? 
            (typeof finalGameTypes === 'string' ? JSON.parse(finalGameTypes) : finalGameTypes) : [23];

        context.log(`Request params - Date range: ${new Date(startTs * 1000)} to ${new Date(finishTs * 1000)}`);
        context.log(`Game types: ${JSON.stringify(gameTypesArray)}, Offset: ${finalOffset}, Count: ${finalCount}`);
        context.log(`Cache settings - Use cache: ${finalUseCache}, Force refresh: ${finalForceRefresh}`);

        let apiResults: any = null;
        let storageResult: any = null;
        let cacheHit = false;

  
    
        const requestPayload = {
            params: {
                StartTs: startTs,
                FinishTs: finishTs,
                GameTypes: gameTypesArray,
                PartnerClientId: 5730,
                Offset: finalOffset,
                Count: finalCount,
                lng: "en"
            },
            userInfo: {
                client: 5730,
                currency: "EUR",
                balance: 1000000000000000,
                lng: "en",
                token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IkQyNTk5NTU5REMxNkI5NkZGNkU5OTI2NkQ2MTdBMDgyQjk2MjdDNUEiLCJ0eXAiOiJKV1QiLCJ4NXQiOiIwbG1WV2R3V3VXXzI2WkptMWhlZ2dybGlmRm8ifQ.eyJuYmYiOjE3NTI5MTAyMTAsImV4cCI6MTc1MjkxMjAxMCwiaXNzIjoiaHR0cHM6Ly9hcGkubmV0L2lkZW50aXR5LWFwaS8iLCJhdWQiOlsiYmV0cy1hcGkiLCJmZWVkcy1hcGkiLCJzaWduYWxyLWZlZWQtYXBpIiwiZXh0ZXJuYWwtY2xpZW50LWFwaSIsInBhcnRuZXJzLWFwaSIsIndlYiIsInNpZ25hbHItYXBpIiwiY2hhdHMtc2lnbmFsci1hcGkiLCJwcm9tb2NvZGVzLWFwaSIsImh0dHBzOi8vYXBpLm5ldC9pZGVudGl0eS1hcGkvcmVzb3VyY2VzIl0sInRva2VuIjoiIiwidXNlcl9wYXJhbWV0ZXJzIjoie1widXNlcl9pZFwiOjM2NjkyODIwLFwicGFydG5lcl9jbGllbnRfaWRcIjo1NzMwLFwidXNlcl9pc3Rlc3RcIjp0cnVlLFwiY3VycmVuY3lfY29kZVwiOlwiRVVSXCIsXCJsYW5ndWFnZVwiOlwiZW5cIixcInVzZXJfcmVnaXN0cmF0aW9uX2RhdGVcIjpcIjIwMjUtMDctMTlUMDc6MzA6MTBaXCIsXCJ0YWdfaWRcIjpudWxsLFwidXNlcl9jbHVzdGVyXCI6bnVsbCxcInBhcnRuZXJfY2xpZW50X2NsdXN0ZXJcIjpcIkxvd1wiLFwiY291bnRyeV9uYW1lXCI6XCJuelwiLFwiZGV2aWNlX25hbWVcIjpcIlwiLFwiZGV2aWNlX29zXCI6XCJXaW5kb3dzXCIsXCJkZXZpY2VfdHlwZVwiOlwiRGVza3RvcFwiLFwiZGV2aWNlX2Jyb3dzZXJcIjpcIkNocm9tZVwiLFwicGFydG5lcl9pZHNcIjpbNDc5NiwyMDAyNDFdfSIsInVzZXJfc2Vzc2lvbl9pZCI6IjJhMDE5ZDBhLTkwOTktNGMwNy1iNDNmLTk3YWJhNTY2NGZmYiIsInJvbGUiOiJQYXJ0bmVyVXNlciIsInBhcnRuZXJfY2xpZW50X2lkIjoiNTczMCIsInBhcnRuZXJfdXNlcl9pZCI6IjRlcGhhYzNlNGotVHZCZXQtRGVtb1NpdGUtVXNlci1CRVQtRVVSIiwiY3VycmVuY3lfY29kZSI6IkVVUiIsImNsaWVudF9pZCI6IlBhcnRuZXJDbGllbnRVc2VyLTU3MzAtNGVwaGFjM2U0ai1UdkJldC1EZW1vU2l0ZS1Vc2VyLUJFVC1FVVIiLCJzY29wZSI6WyJiZXRzLWFwaSIsImZlZWRzLWFwaSIsInNpZ25hbHItZmVlZC1hcGkiLCJleHRlcm5hbC1jbGllbnQtYXBpIiwicGFydG5lcnMtYXBpIiwid2ViIiwic2lnbmFsci1hcGkiLCJjaGF0cy1zaWduYWxyLWFwaSIsInByb21vY29kZXMtYXBpIl19.cGAwzKMWdnB4OneDFy5qDboPosFrTUYyt9JppxVIOlZxpINqTDbFcqyVXRSIdUw_7ECmSvlqVHOUhu_HNBX5yGDDahk6bM1-2pL2iipM432Bhj3-MSJ43AfwVFGr6MgYFUUmDkj4V_IBEMoatpeQR0uL0-6hA--FEppu51275FGDKAk9atPyunz-61kPSLZb869gIvPjGdTPDA56aNEt51b5gsXE9NmqaFAmGrNC0WsBKaU2CJdlOuhbn78PjxJGXKjBBU6WvlXnx8BP5HXZPqX4IZ2wqegTpU6kxBdvSzO9R61JSE32KQ511gCX8k9fJJydkeoUnxo8lM_FIiEqKJiT-fLAm_KYcd_Gz_YaqSJnQfn2ZGiR2ZlTMYLN_y8FEsugpjrUnV55SBE69P2_2I4kaSRzF7SnjonxGdd9LFBtQ4vdLgyqUYwdH0Au2tRem5yDPXocJf8dm_Ax90LQxfeHfv3C5x55tbAIXOqNn3jXe3B3GkVyeSZPdm-RcscfRglRfPNa7ygdP3-7lsIOHML_vhyKRbWHVyaMSy69NujHvkKKOgg-elFdTqsHGrezBEY_6_gCaqYLY59UwZgtwmxjMVB834-4ab2VCOyY89VpS0NMiPPRL7N0kK0d-0zq3KTznFYM56cOh-vrAeObRgfStbWCVQ6PA-fBAljIN74",
                serviceToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IkQyNTk5NTU5REMxNkI5NkZGNkU5OTI2NkQ2MTdBMDgyQjk2MjdDNUEiLCJ0eXAiOiJKV1QiLCJ4NXQiOiIwbG1WV2R3V3VXXzI2WkptMWhlZ2dybGlmRm8ifQ.eyJuYmYiOjE3NTI5MTAyMDksImV4cCI6MTc1NTUwMjIwOSwiaXNzIjoiaHR0cHM6Ly9hcGkubmV0L2lkZW50aXR5LWFwaS8iLCJhdWQiOlsiaHR0cHM6Ly9hcGkubmV0L2lkZW50aXR5LWFwaS9yZXNvdXJjZXMiLCJiZXRzLWFwaSIsImNoYXRzLXNpZ25hbHItYXBpIiwiZXh0ZXJuYWwtY2xpZW50LWFwaSIsImZlZWRzLWFwaSIsImdhbWVldmVudHR5cGVzLWFwaSIsImphY2twb3RzLWFwaSIsInBhcnRuZXJzLWFwaSIsInBhcnRuZXJ3YWxsZXRzLWFwaSIsInByb21vY29kZXMtYXBpIiwic2lnbmFsci1hcGkiLCJzaWduYWxyLWZlZWQtYXBpIiwid2ViIl0sImNsaWVudF9pZCI6IldlYiIsInJvbGUiOiJXZWIiLCJzY29wZSI6WyJiZXRzLWFwaSIsImNoYXRzLXNpZ25hbHItYXBpIiwiZXh0ZXJuYWwtY2xpZW50LWFwaSIsImZlZWRzLWFwaSIsImdhbWVldmVudHR5cGVzLWFwaSIsImphY2twb3RzLWFwaSIsInBhcnRuZXJzLWFwaSIsInBhcnRuZXJ3YWxsZXRzLWFwaSIsInByb21vY29kZXMtYXBpIiwic2lnbmFsci1hcGkiLCJzaWduYWxyLWZlZWQtYXBpIiwid2ViIl19.3lk2sSYWOEa092kK_BQjqyMN478PStUwwvg7RKDKgdM8-o6Bkr6KAJNkDHDBaOHX2gxWCYGS2rGIIBDsUT9nNzNdd3q5N1CNMWWPW0iYCWbFlaMq_AJAnPjUbOExUJgLWBYCayDLMW422AOe0HMf9fJE9XPpwMLNgWHINKSRdzQpzIE1vn0wujhxh3_UTUi692zM80VXnk-pcJMzk8TOHw7ugwZsd15relrSqu_iQsVcCXTN98iK_H08C1NEJxSwvq248qJTzr1Gzws3yNc9WKbb4ou_caXPG1HyjS3sVbfnPyAMG8NlbdOJMCGavQl3soy79nNrUrjSttbq7zjssFgmWm-LC46XJ7ktjzp8GBy-Lzy1dfdK5ecNNPEHTKcX0Eg2dGI_PhW-VppVnSLaW_Zvki82Ht-gcBHibVf1gx6V0IxqCVh_W2o0T4daB-8DKTLIfBpURMJFBgwsuXgvawQL7fKirG8MpqdTjb_rXIZt4CiCdmPVmr-IzHgxJ7kJI480XXhkyYVwt4hLEWk-TnQkDJfN-mIeKWqqXdBvuK0EjaqXKjFgFRLkF4uh2tw5du1W4GazyhZAVh4emrlD80XLSAPTwR9RyFNy-S-QF84KuAH6JN3PXwTN0t6baetOgiRNIsPI8s1QLP2vqQVN9NmncF73M-s8D68oErSbD6Y",
                tagid: null,
                stage: "9999",
                userId: 36692820,
                partnerUserId: "4ephac3e4j-TvBet-DemoSite-User-BET-EUR",
                refreshToken: "4ephac3e4j-TvBet-DemoSite-User-BET"
            }
        };

     
        context.log('Fetching fresh data from TVBet API...');
        const response = await fetch("https://tvbetframe.com/api/getResults", {
            method: "POST",
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "no-cache",
                "content-type": "application/json",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "sec-fetch-storage-access": "none",
                "ua-pixels": "2843x1191"
            },
            body: JSON.stringify(requestPayload),
            mode: "cors"
        });

        if (!response.ok) {
            context.error(`TVBet API request failed with status: ${response.status} ${response.statusText}`);
            return {
                status: response.status,
                jsonBody: { 
                    error: "Failed to fetch results from TVBet API",
                    details: `HTTP ${response.status}: ${response.statusText}`
                }
            };
        }

        apiResults = await response.json();
        context.log(`Successfully fetched ${apiResults?.data?.length || 0} results from TVBet API`);

      
 

        
        const results = {
            timestamp: new Date().toISOString(),
            source: 'tvbet_api',
            requestParams: {
                startDate: new Date(startTs * 1000).toISOString(),
                endDate: new Date(finishTs * 1000).toISOString(),
                gameTypes: gameTypesArray,
                offset: finalOffset,
                count: finalCount
            },
            cacheHit: false,
            data: apiResults
        };

        return {
            jsonBody: results,
            status: 200
        };

    } catch (error) {
        context.error('Error in getResults function:', error);
        
        return {
            status: 500,
            jsonBody: { 
                error: "Internal Server Error",
                details: error instanceof Error ? error.message : "Unknown error occurred"
            }
        };
    }
}


app.http('getResults', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: getResults
});
