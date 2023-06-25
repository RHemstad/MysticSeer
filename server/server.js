
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

//function which accepts an object
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

//creat an instance of open ai
const openai = new OpenAIApi(configuration);

//initialize express
const app = express();
app.use(cors());
app.use(express.json());

//get route 
app.get('/', async (req,res) => {
    res.status(200).send({
        message: 'Hello from CodeX',
    })
});

//post route - payload
app.post('/', async (req,res) =>  {
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion ({

            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,  //highter temp means more risks
            max_tokens: 3000, //max number of tokens to generate
            top_p: 1,
            frequency_penalty: 0.5, //won't repeat same words
            presence_penalty: 0
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({error});
    }
});

//listen for new requests with callback function to let us know that it started
app.listen(5000, () => console.log('Server running on http://localhost:5000 '));

