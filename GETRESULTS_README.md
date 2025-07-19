# getResults Function Documentation

## Overview

The `getResults` function is an Azure Function that fetches gaming results from the TVBet API. It acts as a proxy/wrapper around the TVBet API, allowing you to retrieve gaming results with flexible date ranges and filtering options.

## Function Details

- **Function Name:** `getResults`
- **HTTP Methods:** GET, POST
- **Authorization Level:** Anonymous
- **Endpoint:** `/api/getResults`

## Parameters

### Query Parameters (GET method)

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `startDate` | string | No | Today | Start date in ISO format (YYYY-MM-DD) |
| `endDate` | string | No | Today | End date in ISO format (YYYY-MM-DD) |
| `gameTypes` | string | No | `[23]` | JSON array of game type IDs |
| `offset` | number | No | `0` | Number of records to skip |
| `count` | number | No | `30` | Maximum number of records to return |

### Request Body (POST method)

```json
{
  "startDate": "2025-07-19",
  "endDate": "2025-07-19",
  "gameTypes": [23],
  "offset": 0,
  "count": 30
}
```

## Usage Examples

### 1. Get Today's Results (Default)

```bash
curl http://localhost:7071/api/getResults
```

### 2. Get Results for Specific Date Range



### 4. POST Request with JSON Body

```bash
curl -X POST http://localhost:7071/api/getResults \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2025-07-19",
    "endDate": "2025-07-19", 
    "gameTypes": [23],
    "offset": 0,
    "count": 10
  }'
```

## Response Format

### Success Response (200)

```json
{
  "timestamp": "2025-07-19T12:00:00.000Z",
  "requestParams": {
    "startDate": "2025-07-19T00:00:00.000Z",
    "endDate": "2025-07-19T23:59:59.000Z",
    "gameTypes": [23],
    "offset": 0,
    "count": 30
  },
  "data": {
    // TVBet API response data
    "success": true,
    "data": [
      // Array of gaming results
    ],
    "total": 100,
    "hasMore": true
  }
}
```

### Error Response (500)

```json
{
  "error": "Internal Server Error",
  "details": "Specific error message"
}
```

### API Error Response (4xx/5xx from TVBet)

```json
{
  "error": "Failed to fetch results from TVBet API",
  "details": "HTTP 401: Unauthorized"
}
```

## Game Types

The function supports various game types. Common game type IDs include:

- `23` - Default game type
- `24` - Alternative game type
- `25` - Another game type

(Note: Consult TVBet API documentation for complete list of game type IDs)

## Authentication

The function uses embedded TVBet API credentials configured for demo/testing purposes. In production, you should:

1. Store credentials securely in Azure Key Vault
2. Implement proper token refresh mechanisms
3. Use environment variables for sensitive data

## Error Handling

The function implements comprehensive error handling:

1. **Input Validation:** Validates date formats and parameters
2. **API Errors:** Handles TVBet API failures gracefully
3. **Network Errors:** Catches network connectivity issues
4. **Parsing Errors:** Handles malformed responses

## Logging

The function logs important information including:

- Request parameters
- Date range calculations
- API request details
- Success/failure status
- Number of results retrieved

## Testing

Use the included test script to validate functionality:

```bash
npm run test:getResults
```

Or test manually with curl commands shown in the examples above.

## Configuration

### Environment Variables

Currently, the function uses hardcoded TVBet API credentials. For production use, configure these as environment variables:

```json
{
  "TVBET_API_URL": "https://tvbetframe.com/api/getResults",
  "TVBET_CLIENT_ID": "5730",
  "TVBET_USER_TOKEN": "your-user-token",
  "TVBET_SERVICE_TOKEN": "your-service-token"
}
```

### Rate Limiting

Consider implementing rate limiting for production deployments to avoid overwhelming the TVBet API.

### Caching

For improved performance, consider implementing caching mechanisms:

- Redis cache for frequently requested date ranges
- Azure Storage caching for historical data
- Memory caching for recent results

## Monitoring

Monitor the following metrics:

- Request count and frequency
- Response times from TVBet API
- Error rates and types
- Data volume transferred

## Security Considerations

1. **API Keys:** Store TVBet credentials securely
2. **Input Validation:** Validate all input parameters
3. **CORS:** Configure appropriate CORS policies
4. **Rate Limiting:** Implement to prevent abuse
5. **Logging:** Avoid logging sensitive information

## Next Steps

1. **Token Management:** Implement automatic token refresh
2. **Caching:** Add Redis/Memory caching for performance
3. **Rate Limiting:** Add request throttling
4. **Data Transformation:** Process TVBet data for your specific needs
5. **Monitoring:** Add Application Insights for detailed telemetry
