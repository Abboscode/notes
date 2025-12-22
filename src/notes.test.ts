import request from 'supertest';
import app from './app.js'; // Your express app instance
import { promises as fs} from 'fs';

const DB_PATH = 'DATA.json';

describe('Notes API Full Route Tests', () => {
    
  //  Reset the JSON file to a clean state before every test
    beforeEach(async () => {
        const seedData = await fs.readFile(DB_PATH, 'utf8');
        await fs.writeFile('DATA_TEST.json', seedData);
    });

describe('GET /notes', () => {
    it('should return 200 and a paginated response object', async () => {
        const res = await request(app).get('/notes');
        
        expect(res.statusCode).toBe(200);
        
        // Check the structure of your response
        expect(res.body).toHaveProperty('page');
        expect(res.body).toHaveProperty('limit');
        expect(res.body).toHaveProperty('totalNotes');
        
        // The actual array is inside .data
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should respect pagination queries', async () => {
        const res = await request(app).get('/notes?page=2&limit=5');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.page).toBe(2);
        expect(res.body.limit).toBe(5);
    });
});

    describe('POST /notes/create', () => {
        it('should return 201 and the new note id on success', async () => {
            const res = await request(app)
                .post('/notes')
                .send({ title: "New", content: "Content" });
            
            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true)
            expect(res.body).toHaveProperty('id');
            
            // Verify file system
            // const fileData = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
            // expect(fileData.length).toBe(2);
        });

        it('should return 400 if validation fails (missing title)', async () => {
            const res = await request(app)
                .post('/notes')
                .send({ content: "Missing Title" });
            
            expect(res.statusCode).toBe(400);
        });
    });

    describe('PATCH notes/:id', () => {
        it('should return 200 and update the note in the file', async () => {
            const res = await request(app)
                .patch('/notes/4')
                .send({ title: "Updated Title" });
            
            expect(res.statusCode).toBe(200);
            
          
        });

        it('should return 404 for a non-existent ID', async () => {
            const res = await request(app).patch('/notes/999').send({ title: "Empty" });
            expect(res.statusCode).toBe(404);
        });
    });

    describe('DELETE /notes/:id', () => {
        it('should return 200 and remove the note from the file', async () => {
            const res = await request(app).delete('/notes/4');
            expect(res.statusCode).toBe(200);

            // const fileData = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
            // expect(fileData.length).toBe(0);
        });
    });

    describe('GET /notes/search', () => {
        it('should return 200 and filtered notes', async () => {
            const res = await request(app).get('/notes/search?keyword=Hello');
            expect(res.statusCode).toBe(200);
            //expect(res.body.length).toBe(1);
        });
    });
});