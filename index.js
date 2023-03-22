const path = require('node:path')
const fs = require('node:fs')

const express = require('express')
const app = express()

const PORT = 3000
const UPLOAD_PATH = path.join(__dirname, 'public/uploads')


app.use('/uploads', express.static(UPLOAD_PATH))
app.use(require('express-fileupload')())


app.post('/upload', (request, response) => {

        const request_has_files = request.files
                && Object.keys(request.files).length > 0

        if (! request_has_files) {
                return response.status(400)
                        .send("No files were provided for upload.")
        }

        const upload = request.files.upload
        const uploadPath = path.join(UPLOAD_PATH, btoa(upload.name))

        upload.mv(uploadPath, error => {
                if (error) return response.status(500)
                        .send("Error uploading file")

                response.redirect('/')
        })
})


app.get('/', (request, response) => {
        const files = fs.readdirSync(UPLOAD_PATH)

        response.send(`
                <html>
                        <head>
                                <title>XCH - Share Files with Friends</title>
                                <meta name='viewport' content='width=device-width,initial-scale=1'>
                                <style>
                                        * { box-sizing: border-box; font-weight: normal; }
                                        html { font: 16px/1.5 sans-serif; }
                                        body { margin: 0 auto; width: 666px; padding: 4rem; }
                                        section { padding: 1rem 2rem; background: #f0f0ff; margin-bottom: 2rem; }
                                </style>
                        </head>
                        <body>
                                <header>
                                        <h1>XCH</h1>
                                </header>
                                <main>
                                        <section class='upload'>
                                                <h2>Upload a File 🤗</h2>
                                                <form
                                                        action='/upload'
                                                        method='post'
                                                        enctype='multipart/form-data'
                                                >
                                                        <input type='file' name='upload'>
                                                        <input type='submit' value='Submit'>
                                                </form>
                                        </section>
                                        <section class='files'>
                                                <h2>Download a File</h2>
                                                <button onclick='window.location.reload()'>Refresh</button>
                                                <ul>
                                                        ${
                                                                files.map(path => {
                                                                        const name = atob(path)
                                                                        return `
                                                                                <li>
                                                                                        <a
                                                                                                href='/uploads/${path}'
                                                                                                download='${name}'
                                                                                        >
                                                                                                ${name}
                                                                                        </a>
                                                                                </li>
                                                                        `
                                                                })
                                                                .join('')
                                                        }
                                                </ul>
                                        </section>
                                </main>
                        </body>
                </html>
        `)
})


app.listen(PORT, () => {
        console.log(`XCH listening on port ${PORT}.`)
})
