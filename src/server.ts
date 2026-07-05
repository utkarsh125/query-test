import {Hono} from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

interface QueryFilter {
    role?: string
    sort?: string 
    page?: number
}

interface User {
    id: number
    role: string 
    name: string 
}

const users: User[] = [
    { id: 1, role: 'admin', name: "Utkarsh"},
    { id: 2, role: 'admin', name: "Rampal"},
    { id: 3, role: 'admin', name: "Toffee"},
]

app.on('OPTIONS', '/users', (c) => {
    c.header('Allow', 'GET, QUERY, OPTIONS')
    c.header('Accept-Query', 'application/json')
    return c.body(null, 204)
})

//lets clients discover that this EP supports QUERY
app.on('QUERY', '/users', async (c) => {

    const contentType = c.req.header('content-type')

    if(!contentType){
        return c.json({
            error: 'Content-Type header is required'
        }, 400)
    }

    if(!contentType.includes('application/json')){
        return c.json({
            error: 'Unsupported content type'
        }, 415)
    }

    let filter: QueryFilter
    try {
        
        filter = await c.req.json()

    } catch (error) {
        
        return c.json({
            error: "Malformed JSON Body"
        }, 400)
    }

    let results = [...users]

    if(filter.role){
        results = results.filter((u) => u.role === filter.role)
    }

    if(filter.sort === 'name'){
        results.sort((a,b) => a.name.localeCompare(b.name))
    }

    console.log('QUERY /users received filter: ', filter)

    return c.json({
        results,
        count: results.length
    })
})

const port = 3000
serve({
    fetch: app.fetch,
    port
}, (info) => {
    console.log(`Server listening on http://localhost:${info.port}`)
})