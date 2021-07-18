const generateExercisesText = require('./generateExercisesText');
const latex = require('node-latex')
let fs = require('fs');
let archiver = require('archiver');
let isPDF = require("is-pdf-valid");

const generateTest = (path, filename, text) => {
    const texPath =  path + filename + '.tex';
    const pdfPath = path + filename + '.pdf';
    fs.writeFileSync(texPath, text, (err) => {
        if (err) {
            console.error(err);
            return err.message;
        }
    })

    const tex_input = fs.createReadStream(texPath);
    const pdf_output = fs.createWriteStream(pdfPath);
    const pdf = latex(tex_input);

    pdf.pipe(pdf_output);
    pdf.on('error', err => {
        console.error(err);
        return err.message;
    });
    pdf.on('finish', () => {
        return filename + ".pdf created";
    });
}

const generateTests = (exercises, all_exercises, num, token, fileName1, fileName2, header, footer) => {
    num.forEach( async (i) => {
        let question_text = "";
        let answer_text = "";
        exercises.map((ex) => {
            for (let j = 1 ; j <= ex.nr ; j++)
            {
                let {question, answer} = generateExercisesText(all_exercises, ex.category, ex.title);
                question_text = question_text + question;
                answer_text = answer_text + answer;
            }
        });
        answer_text = question_text + answer_text;
        let question_txt = header + question_text + footer;
        let answer_txt = header + answer_text + footer;
        
        generateTest("./src/files/" + token + '/', fileName1 + (i+1), question_txt);
        generateTest("./src/files/" + token + '/', fileName2 + (i+1), answer_txt);
    })
}

const createFolder = (dirName) => {
    if (!fs.existsSync(dirName)){
        fs.mkdirSync(dirName);
    }
}

const removeFolder = (dirName) => {
    if (fs.existsSync(dirName)){
        fs.rmSync(dirName, { recursive: true });
    }
}

const zipFiles = async (root, token, zipName) => {
    let archive = archiver("zip", { zlib: { level: 9 } });
    let zip_output = fs.createWriteStream(root + zipName);

    archive.on('error', (err) => {
        if (err) {
            console.error(err);
            return err.message;
        }
    });
    await archive.pipe(zip_output);
    await archive.glob('*.pdf', {cwd: root + token});
    await archive.glob('*.tex', {cwd: root + token});
    await archive.finalize();
}

const createZipFile = async (all_exercises, exercises, params, token) => {
    const fileName1 = "Test";
    const fileName2 = "Solution";
    let zipName = token + '.zip';
    let num = [];

    let header =    "\\documentclass[12pt]{article}\n" + 
                    "\\usepackage[utf8]{inputenc}\n" +
                    "\\usepackage[magyar]{babel}\n" +
                    "\\usepackage{amsmath, geometry}\n" +
                    "\\usepackage{amsfonts}\n" +
                    "\\usepackage{amssymb}\n" +
                    "\\usepackage{enumitem}\n" +
                    "\\usepackage{mathrsfs}\n" +
                    "\\usepackage{fancyhdr}\n" +
                    "\\newtheorem{fel}{Feladat}\n" +
                    "\\newtheorem{meg}{Megoldás}\n" +
                    "\\newtheorem{megj}{Megjegyzés}\n" +
                    "\\geometry{\n" +
                    "   a4paper,\n" +
                    "   total={170mm,257mm},\n" +
                    "   left=20mm,\n" +
                    "   top=20mm,\n}\n" +
                    "\\thispagestyle{fancy}\n" +
                    "\\fancyfoot[C]{" + 
                    "\n" + `${params.begin}` + " - " + `${params.end}` + "\n}\n" +
                    "\\fancyhead[L]{";
                        if(params.class)
                            header = header + "\n\\huge{" + `${params.title}` + " - " + `${params.class}` + " osztály}\n}\n";
                        else
                            header = header + "\n\\huge{" + `${params.title}` + "}\n}\n";
                    
                    header =    header + "\\fancyhead[R]{\n" + 
                    "\\large{" + `${params.date}` + "}\n}\n" + 
                    "\\begin{document}\n\n";
    if(params.description)
    {
        header =    header + 
                    "\\begin{description}\n\\item{\n" +
                    "Leírás: " + `${params.description}\n}\n` + 
                    "\\end{description}\n\n";
    }

    const footer = "\n\n\\end{document}\n";

    for (let i = 0 ; i < params.number ; i++)
        num[i]=i;

    createFolder("./src/files/" + token);

    await generateTests(exercises, all_exercises, num, token, fileName1, fileName2, header, footer);

    const waitingId = setInterval( async () => {
        let filesExists = true;
        for(let i = 1 ; i <= params.number ; i++)
        {
            const file1 = fs.readFileSync("./src/files/" + token + '/' + fileName1 + i + ".pdf");
            const file2 = fs.readFileSync("./src/files/" + token + '/' + fileName2 + i + ".pdf");
            if(!isPDF(file1) || !isPDF(file2))
                filesExists = false;
        }
        if(filesExists) {
            zipFiles('./src/files/',token, zipName)
            .then(() => {
                removeFolder('./src/files/' + token);
            })
            clearInterval(waitingId);
        }
    }, 1000)
    
}

module.exports = createZipFile;