import { app, InvocationContext, Timer } from "@azure/functions";

const body = {
  params: {
    StartTs: 1752840000,
    FinishTs: 1752926399,
    GameTypes: [9],
    PartnerClientId: 5730,
    Offset: 30,
    Count: 30,
    lng: "en",

  },
  userInfo: {
    // "client": 5730,
    // "currency": "EUR",
    // "balance": 1000000000000000,
    // "lng": "en",
    // "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IkQyNTk5NTU5REMxNkI5NkZGNkU5OTI2NkQ2MTdBMDgyQjk2MjdDNUEiLCJ0eXAiOiJKV1QiLCJ4NXQiOiIwbG1WV2R3V3VXXzI2WkptMWhlZ2dybGlmRm8ifQ.eyJuYmYiOjE3NTI4OTA4MTksImV4cCI6MTc1Mjg5MjYxOSwiaXNzIjoiaHR0cHM6Ly9hcGkubmV0L2lkZW50aXR5LWFwaS8iLCJhdWQiOlsiYmV0cy1hcGkiLCJmZWVkcy1hcGkiLCJzaWduYWxyLWZlZWQtYXBpIiwiZXh0ZXJuYWwtY2xpZW50LWFwaSIsInBhcnRuZXJzLWFwaSIsIndlYiIsInNpZ25hbHItYXBpIiwiY2hhdHMtc2lnbmFsci1hcGkiLCJwcm9tb2NvZGVzLWFwaSIsImh0dHBzOi8vYXBpLm5ldC9pZGVudGl0eS1hcGkvcmVzb3VyY2VzIl0sInRva2VuIjoiIiwidXNlcl9wYXJhbWV0ZXJzIjoie1widXNlcl9pZFwiOjM2Njg5ODkxLFwicGFydG5lcl9jbGllbnRfaWRcIjo1NzMwLFwidXNlcl9pc3Rlc3RcIjp0cnVlLFwiY3VycmVuY3lfY29kZVwiOlwiRVVSXCIsXCJsYW5ndWFnZVwiOlwiZW5cIixcInVzZXJfcmVnaXN0cmF0aW9uX2RhdGVcIjpcIjIwMjUtMDctMTlUMDI6MDY6NTlaXCIsXCJ0YWdfaWRcIjpudWxsLFwidXNlcl9jbHVzdGVyXCI6bnVsbCxcInBhcnRuZXJfY2xpZW50X2NsdXN0ZXJcIjpcIkxvd1wiLFwiY291bnRyeV9uYW1lXCI6XCJuelwiLFwiZGV2aWNlX25hbWVcIjpcIlwiLFwiZGV2aWNlX29zXCI6XCJXaW5kb3dzXCIsXCJkZXZpY2VfdHlwZVwiOlwiRGVza3RvcFwiLFwiZGV2aWNlX2Jyb3dzZXJcIjpcIkNocm9tZVwiLFwicGFydG5lcl9pZHNcIjpbNDc5NiwyMDAyNDFdfSIsInVzZXJfc2Vzc2lvbl9pZCI6IjQ5MWYzZjBjLTgwZjktNGFmZS1hYTVlLWI2NjBkMjc2MTBkNSIsInJvbGUiOiJQYXJ0bmVyVXNlciIsInBhcnRuZXJfY2xpZW50X2lkIjoiNTczMCIsInBhcnRuZXJfdXNlcl9pZCI6ImpzOWlucnJrN3EtVHZCZXQtRGVtb1NpdGUtVXNlci1CRVQtRVVSIiwiY3VycmVuY3lfY29kZSI6IkVVUiIsImNsaWVudF9pZCI6IlBhcnRuZXJDbGllbnRVc2VyLTU3MzAtanM5aW5ycms3cS1UdkJldC1EZW1vU2l0ZS1Vc2VyLUJFVC1FVVIiLCJzY29wZSI6WyJiZXRzLWFwaSIsImZlZWRzLWFwaSIsInNpZ25hbHItZmVlZC1hcGkiLCJleHRlcm5hbC1jbGllbnQtYXBpIiwicGFydG5lcnMtYXBpIiwid2ViIiwic2lnbmFsci1hcGkiLCJjaGF0cy1zaWduYWxyLWFwaSIsInByb21vY29kZXMtYXBpIl19.isQ7Ak4YwA5w0j6FQHd204VA0xxhWHL8Wnl3kkBFmhf5nleM6ATv4t7tp2VYcaJvj7KobwXigV-BS2evYy1VMyLNCfcXbTIMccZDTXmhQS9fyz9jOzO74Zn-lOOJtDxM9a9vvvWddEP7jP9XumtG4iZffYTRIG6BxLWdXzKdnqp8DPZBKfVDVE3kRQnMrHl2g6NWeRokbrS1oG7cBPrYcgaJAcOBpfU3O1yVuJMr_TrBcASZGmPCYsNPnIq4-0uR5BjXYPYTxe7t4sm35yGYUJMvMatWW9mM4SZa96ZD1j7N-UjiblSwCO5cfEwy8ycUoeDpsSXwSEga7Tr5-SoXlTYvpBJzOjrC-i3zZgJip29QsUgb6CBH876MFT0DxZ0gsOu19_qsYdxf2n5J7k30KQDiosxt5RZpJPODBuHOUziNfhk27tgQVXhfxQnhDyWb5w1hhHaJ11EZWnSpd5c1qnuv5gX1emh8Qjl_dORjTGpcDbNeppAKPcVP7wcRM4Je5BP_JX9PxSzt7FkOIiHxmZlKbMlcHT4FuCwr2Mt7ig5vsQgnD6JeCZPDbam7G3wQk7wnsitX9KKKjV1a63ltqVbW4E9nj5unForLHA3qtHZebg1emCFgMnU2g4q3v4TmrY1lReBqbx__l-xJ4SJP9NG1lGT3uKapSPuYNKjnFdk",
    // "serviceToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IkQyNTk5NTU5REMxNkI5NkZGNkU5OTI2NkQ2MTdBMDgyQjk2MjdDNUEiLCJ0eXAiOiJKV1QiLCJ4NXQiOiIwbG1WV2R3V3VXXzI2WkptMWhlZ2dybGlmRm8ifQ.eyJuYmYiOjE3NTI4OTA4MTYsImV4cCI6MTc1NTQ4MjgxNiwiaXNzIjoiaHR0cHM6Ly9hcGkubmV0L2lkZW50aXR5LWFwaS8iLCJhdWQiOlsiaHR0cHM6Ly9hcGkubmV0L2lkZW50aXR5LWFwaS9yZXNvdXJjZXMiLCJiZXRzLWFwaSIsImNoYXRzLXNpZ25hbHItYXBpIiwiZXh0ZXJuYWwtY2xpZW50LWFwaSIsImZlZWRzLWFwaSIsImdhbWVldmVudHR5cGVzLWFwaSIsImphY2twb3RzLWFwaSIsInBhcnRuZXJzLWFwaSIsInBhcnRuZXJ3YWxsZXRzLWFwaSIsInByb21vY29kZXMtYXBpIiwic2lnbmFsci1hcGkiLCJzaWduYWxyLWZlZWQtYXBpIiwid2ViIl0sImNsaWVudF9pZCI6IldlYiIsInJvbGUiOiJXZWIiLCJzY29wZSI6WyJiZXRzLWFwaSIsImNoYXRzLXNpZ25hbHItYXBpIiwiZXh0ZXJuYWwtY2xpZW50LWFwaSIsImZlZWRzLWFwaSIsImdhbWVldmVudHR5cGVzLWFwaSIsImphY2twb3RzLWFwaSIsInBhcnRuZXJzLWFwaSIsInBhcnRuZXJ3YWxsZXRzLWFwaSIsInByb21vY29kZXMtYXBpIiwic2lnbmFsci1hcGkiLCJzaWduYWxyLWZlZWQtYXBpIiwid2ViIl19.gXa-u-yTmvA2_P67wxNpue3oVEU-slseMaelx1Dn6Ksq85skLFH7aRbYcZPQgTbcZicOukVI94pSLW-tkFWI-muWth55Cehz9lrN7ONmzKMssIt7Wexoov5Nv2KjzkhjqU90SVGx2asU-0CkUCdU-4ImdoWd8NvAVO6py17R1P8Hkh9HQmC-vLZKDUpNI_AgvEcaP9RETjCFCSjFEbYxfs-Lod3jGigBnljqiUAcYCP3cVhJcFaOSVfRSD4-mpbNBQbo2jOggR78pRd2YMXxx-TtsAL_hPMrDBlLDnPRBlQW9WoIn9Vo9gBOgsYRW_SzRZy279B8-S05Qje82pHjAbHE5VLrWcCsLYWFihAxDcFvU_6N4111HEg_88ipXDcKnAhDpcP8B3mHcwisl9VbwIpuLPru_hmdX_bkIe-HzbAryVpUSZ09bO1fN0uJ3jveuTBoO042F8cevBa3DxhRQ85B5WpWM-Eoy5qq4wO9rVKeecn0_AFrlksahZ7MbklrmSwe1YH5IF9kPyHgiX0GKZsOzYhcLMwZwyShS08WAh5fjYNI0kG9fgN6dMauDEsJ80i_ocNky_VXEzPbDD5vCc1qMxlZk6MwXHtDu5C_-ADpY8RMBk-yGxEXfd4QL_eeltS-Xq_DqoKK_wZXykxCzim6g_HqkY8TN5V8VEGsHP4",
    // "tagid": null,
    stage: "9999",
    // "userId": 36689891,
    // "partnerUserId": "js9inrrk7q-TvBet-DemoSite-User-BET-EUR",
    // "refreshToken": "js9inrrk7q-TvBet-DemoSite-User-BET"
  },
};

export async function timerTrigger1(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log("Timer function processed request.");
  const response = await fetch("https://tvbetframe.com/api/getResults", {
    method: "POST",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    context.log("Failed to fetch results:", response.statusText);
    return;
  }
  context.log("Results fetched successfully:", await response.json());
}

app.timer("timerTrigger1", {
  schedule: "*/15 * * * * *",
  handler: timerTrigger1,
});
