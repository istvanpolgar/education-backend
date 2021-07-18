
const getFakt = (number) => {
    if(number == 0)
        return 1;
    else
        return number*getFakt(number-1);
}

const getRange = (a,b) => {
    let p = 1
    let i = a;

    while (i <= b) {
        p = p * i;
        i++;
    }
    return p;
}

const getC = (n,k) => {
    let d = (k < n-k) ? n-k : k;
    return getRange(d+1,n)/getRange(1,n-d);
}

const getV = (n,k) => {
    return getRange(n-k+1,n);
}

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const question1 = (a,b,type) => {
    let text = "\\begin{fel}\n";
        switch(type) {
            case 1: {
                text = text + "Számítsd ki a $P_" + a + "+P_" + b + "$ kifejezés értékét";
                break;
            }
            case 2: {
                text = text + "Számítsd ki a $V_{" + a + "}^{" + b + "}$ kifejezés értékét";
                break;
            }
            case 3: {
                text = text + "Számítsd ki a $C_{" + a + "}^{" + b + "}$ kifejezés értékét";
                break;
            }
            default: text = text + "";
        }
    text = text + "\\end{fel} \n\n";
    return text;
}

const answer1 = (a,b,type) => {
    let text = "\n\\begin{meg}\n ";
        switch(type) {
            case 1: {
                text = text + "$P_" + a + "+P_" + b + "=" + a + "!+" + b + "!=" + getFakt(a) + "+" + getFakt(b) + "=";
                text = text + (getFakt(a) + getFakt(b)) + "$";
                break;
            }
            case 2: {
                text = text + "$V_{" + a + "}^{" + b + "}=\\frac{" + a + "!}{(" + a + " - " + b + ")!}=";
                text = text + "\\frac{" + a + "!}{" + (a - b) + "!}=";
                if(b == 0)
                    text = text + "1$";
                else
                    if(b == 1)
                        text = text + a + "$";
                    else
                        if(a == b || a == b+1)
                            text = text + getFakt(a) + "$";
                        else
                        {
                            text = text + "\\frac{";
                            let k = a;
                            while(k > a-b) {
                                text = text + k + "\\cdot";
                                k--;
                            }
                            text = text + k + "!}{" + (a - b) + "!}=";
                            text = text + getV(a,b) + "$";
                        }
                break;
            }
            case 3: {
                text = text + "$C_{" + a + "}^{" + b + "}=\\frac{" + a + "!}{" + b + "!\\cdot(" + a + " - " + b + ")!}=";
                text = text + "\\frac{" + a + "!}{" + b + "!\\cdot" + (a - b) + "!}=";
                if(b == 0 || a == b)
                    text = text + "1$";
                else
                    if(b == 1 || a == b+1)
                        text = text + a + "$";
                    else
                    {
                        text = text + "\\frac{";
                        let k = a;
                        let d = (b > a-b) ? b : a-b;
                        while(k > d) {
                            text = text + k + "\\cdot";
                            k--;
                        }
                        text = text + k + "!}{" + b + "!\\cdot" + (a - b) + "!}=";
                        text = text + getC(a,b) + "$";
                    }
                break;
            }
            default: text = text + "";
        }
    text = text + "\n\\end{meg}\n";
    return text;
}

const question2 = (a,b,type, type2) => {
    let text = "\\begin{fel}\n";
        switch(type) {
            case 1: {
                let object = "";
                switch(type2){
                    case 1: object = "könyv"; break;
                    case 2: object = "pohár"; break;
                    case 3: object = "váza"; break;
                    case 4: object = "cserepes virág"; break;
                    default: object = "valami";
                }
                text = text + a + " " + object + " hányféle sorrendben helyezhető fel egy polcra?";
                break;
            }
            case 2: {
                switch(type2){
                    case 1: object = "ovodást"; break;
                    case 2: object = "mozi nézőt"; break;
                    case 3: object = "embert"; break;
                    case 4: object = "gyereket"; break;
                    default: object = "valamit";
                }
                text = text + a + " " + object + " hányféleképpen tudunk leültetni " + b + " székre?";
                break;
            }
            case 3: {
                switch(type2){
                    case 1: object = "emberből"; break;
                    case 2: object = "diákból"; break;
                    case 3: object = "tagból"; break;
                    case 4: object = "csapattagból"; break;
                    default: object = "valami";
                }
                text = text + a + " " + object + " hányféleképpen tudunk kialakítani egy " + b + " főből álló csoportot?";
                break;
            }
            default: text = text + "";
        }
    text = text + "\\end{fel} \n\n";
    return text;
}

const answer2 = (a,b,type) => {
    let text = "";
    switch(type) {
        case 1: {
            text = "\n\\begin{meg}\n ";
            text = text + "$P_" + a + "=" + a + "!=" + getFakt(a) + "$";
            text = text + "\n\\end{meg}\n";
            break;
        }
        case 2: {
            text = answer1(a,b,type);
            break;
        }
        case 3: {
            text = answer1(a,b,type);
            break;
        }
        default: text = text + "";
    }
    return text;
}

const generated_exercise = (type) => {
    let question = "";
    let answer = "";
    switch(type)
    {
        case 1: {
            const a = getRandomInt(1,10);
            let b = getRandomInt(0,10);
            while(a < b)
                b = getRandomInt(0,10);
            const c = getRandomInt(1,4);
            question = question + question1(a,b,c); 
            answer = answer + answer1(a,b,c);
            break;
        }
        case 2: {
            const a = getRandomInt(3,10);
            let b = getRandomInt(2,10);
            while(a <= b)
                b = getRandomInt(2,10);
            const c = getRandomInt(1,4);
            const d = getRandomInt(1,5);
            question = question + question2(a,b,c,d); 
            answer = answer + answer2(a,b,c);
            break;
        }
        default: question = "Exercise is undefind"; answer = "Exercise is undefind";
    }
    return {
        question: question, 
        answer: answer
    };
};

module.exports = generated_exercise;