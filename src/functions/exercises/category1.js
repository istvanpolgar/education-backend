const getSign = (value) => {
    if (value >= 0)  return "+";
    else             return "-";
}

const getSignedInt = (number) => {
    if (number == 0)
        return "";
    return getSign(number) + Math.abs(number);
}

const getUnsignedInt = (number,zero,one) => {
    if (number == 0 && !zero)
        return "";
    if (number == 0 && zero)
        return "0";
    if (number == 1 && one)
        return "";
    if (number == -1 && one)
        return "-";
    if (number > 0)
        return Math.abs(number);
    return getSign(number) + Math.abs(number);
}

const getSignedFrac = (numerator, denominator) => {
    if (numerator == 0)
        return "";
    if (denominator == 0)
        return "undefind";
    if (numerator%2 == denominator%2)
        return getSign(1) + "\\frac{" + Math.abs(numerator) + "}{" + Math.abs(denominator) + "}";
    return getSign(-1) + "\\frac{" + Math.abs(numerator) + "}{" + Math.abs(denominator) + "}";
}

const getUnsignedFrac = (numerator, denominator, zero) => {
    if (numerator == 0 && zero)
        return "0";
    if (numerator == 0 && !zero)
        return "";
    if (denominator == 0)
        return "undefind";
    if (numerator * denominator > 0)
        return "\\frac{" + Math.abs(numerator) + "}{" + Math.abs(denominator) + "}";
    return getSign(-1) + "\\frac{" + Math.abs(numerator) + "}{" + Math.abs(denominator) + "}";
}

const getLNKO = (a,b) => {
    if (a == 0 || b == 0)
        return -1;
    while(a != b)
    {
        if (a > b)  a=a-b;
        else        b=b-a;
    }
    return a;
}

const getSimplifiedFrac = (numerator, denominator) => {
    let lnko = getLNKO(Math.abs(numerator),Math.abs(denominator));

    if (numerator%denominator == 0 && lnko!=-1)
        return "=" + getUnsignedInt(numerator/denominator) + "\n";
    
    if (lnko == -1 || lnko == 1)
        return "";

    numerator /= lnko;
    denominator /= lnko;
    return "=" + getUnsignedFrac(numerator, denominator) + "\n";
}

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const question1 = (a,b) => {
    let text = "\\begin{fel}\n";
    text = text + "Oldd meg a $" + getUnsignedInt(a,false,true) + "x" + getSignedInt(b) + "=0$ egyenletet a valós számok halmazán! \n";
    text = text + "\\end{fel} \n\n";
    return text;
}

const answer1 = (a,b) => {
    let text = "\n\\begin{meg} ";
    text = text + "$" + getUnsignedInt(a,false,true) + "x" + getSignedInt(b) + "=0 \\Leftrightarrow \n";
    if (b != 0)
    {
        text = text + getUnsignedInt(a,false,true) + "x=" + getUnsignedInt(-b,true);
        if (a != 1)
        {
            text = text + "\\Leftrightarrow \n"; 
            if (a != -1)
                text = text + "x=" + getUnsignedFrac(-b,a,true) + "\n";
            else
                text = text + "x";
            text = text + getSimplifiedFrac(-b,a);
        }
    }
    else
        text = text + "x=0";
    text = text + "$\n\\end{meg}\n";
    return text;
}

const generated_exercise = (type) => {
    let question = "";
    let answer = "";
    switch(type)
    {
        case 1: {
            let a = getRandomInt(-30,30);
            while(a === 0)
                a = getRandomInt(-30,30);
            const b = getRandomInt(-30,30);
            question = question + question1(a,b); 
            answer = answer + answer1(a,b);
            break;
        }
        default: console.log("Ajjajajjaajajaj");
    }
    return {
        question: question, 
        answer: answer
    };
};

module.exports = generated_exercise;