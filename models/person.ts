type KeyValue = { [key: string]: string };
type Tuple = [string, string];
type KeyArray = { [key: string]: string[] };

export class FamilyManager {
    genderList!: KeyValue;
    coupleList!: Tuple[];
    childList!: KeyArray;

    constructor() {
        this.initFamily();
    }
    
    initFamily() {
        this.genderList = {
            Shan: 'm',
            Anga: 'f',
            Chit: 'm', Amba: 'f', Ish: 'm', Vich: 'm', Lika: 'f', Aras: 'm', Chitra: 'f', Satya: 'f', Vyan: 'm',
            Dritha: 'f', Jaya: 'm', Tritha: 'f', Vritha: 'm', Vila: 'f', Chika: 'f', Arit: 'm', Jnki: 'f', Ahit: 'm', Satvy: 'f', Asva: 'm', Krpi: 'f', Vyas: 'm', Atya: 'f',
            Yodhan: 'm', Laki: 'm', Lavnya: 'f', Vasa: 'm', Kriya: 'm', Krithi: 'f'
        };

        this.coupleList = [
            ['Shan', 'Anga'],
            ['Chit', 'Amba'], ['Vich', 'Lika'], ['Aras', 'Chitra'], ['Satya', 'Vyan'],
            ['Dritha', 'Jaya'], ['Arit', 'Jnki'], ['Satvy', 'Asva'], ['Krpi', 'Vyas']
        ];

        this.childList = {
            Anga: ['Chit', 'Ish', 'Vich', 'Aras', 'Satya'],
            Amba: ['Dritha', 'Tritha', 'Vritha'],
            Lika: ['Vila', 'Chika'],
            Chitra: ['Jnki', 'Ahit'],
            Satya: ['Asva', 'Vyas', 'Atya'],
            Dritha: ['Yodhan'],
            Jnki: ['Laki', 'Lavnya'],
            Satvy: ['Vasa'],
            Krpi: ['Kriya', 'Krithi']
        };
    }
    
    addChild(motherName: string, childName: string, gender: string): string {
        const shortGender = gender === 'Male' ? 'm' : 'f';
        if (motherName in this.childList) {
            this.genderList[childName] = shortGender;
            this.childList[motherName].push(childName);
            return "CHILD_ADDITION_SUCCEEDED";
        } else if (motherName in this.genderList) {
            return "CHILD_ADDITION_FAILED";
        }
        return "PERSON_NOT_FOUND";
    }

    //GET_RELATIONSHIP handler
    getRelationship(name: string, relation: string): string {
        const methodName = `get${relation.replace(/-/g, '')}`;
        const isDefined = (this as any)[methodName];
        if (!isDefined) {
            return `Unknown or invalid relation: ${relation}`;
        }

        if (!this.genderList[name]) {
            return "PERSON_NOT_FOUND";
        }

        const result = (this as any)[methodName](name);
        if (result === null || result.length === 0) {
            return "NONE";
        }

        return (result as string[]).join(' ');
    }
    
    // spouse's brothers + sisters' husbands
    getBrotherInLaw(name: string) {
        const spouse = this.getSpouseName(name);
        const spouseBrothers: string[] = spouse ? this.getBrothers(spouse) || [] : [];

        const sisters = this.getSisters(name);
        const sisterHusbands: string[] = [];
        if (sisters) {
            sisters.forEach(bro => {
                const sisHubby = this.getSpouseName(bro);
                if (sisHubby) sisterHusbands.push(sisHubby);
            })
        }
        return [...spouseBrothers, ...sisterHusbands];
    }
    
    // spouse's sisters + brothers' wives
    getSisterInLaw(name: string) {
        const spouse = this.getSpouseName(name);
        const spouseSisters: string[] = spouse ? this.getSisters(spouse) || [] : [];

        const brothers = this.getBrothers(name);
        const brotherWives: string[] = [];
        if (brothers) {
            brothers.forEach(bro => {
                const broWife = this.getSpouseName(bro);
                if (broWife) brotherWives.push(broWife);
            })
        }
        return [...spouseSisters, ...brotherWives];
    }
    
    // mother's sisters
    getMaternalAunt(name: string) {
        const mother = this.getMotherName(name);
        if (mother) {
            return this.getSisters(mother);
        }
        return null;
    }

    // father's sisters
    getPaternalAunt(name: string) {
        const father = this.getFatherName(name);
        if (father) {
            return this.getSisters(father);
        }
        return null;
    }

    // mother's brothers
    getMaternalUncle(name: string) {
        const mother = this.getMotherName(name);
        if (mother) {
            return this.getBrothers(mother);
        }
        return null;
    }

    // father's brothers
    getPaternalUncle(name: string) {
        const father = this.getFatherName(name);
        if (father) {
            return this.getBrothers(father);
        }
        return null;
    }
    public getDaughter(name: string) {
        const children = this.getChildren(name);
        return children ? children.filter(x => this.genderList[x] === 'f') : null;
    }
    public getSon(name: string) {
        const children = this.getChildren(name);
        return children ? children.filter(x => this.genderList[x] === 'm') : null;
    }
    public getChildren(name: string) {
        name = this.genderList[name] === 'f' ? name : this.getSpouseName(name) || "";
        let children = name.length > 0 ? this.childList[name] : null;
        
        return children;
    }
    public getSisters(name: string) {
        const siblings = this.getSiblings(name);
        return siblings ? siblings.filter(x => this.genderList[x] === 'f') : null;
    }
    public getBrothers(name: string) {
        const siblings = this.getSiblings(name);
        return siblings ? siblings.filter(x => this.genderList[x] === 'm') : null;
    }
    public getSiblings(name: string) {
        const mother = this.getMotherName(name);
        if (mother) {
            return this.childList[mother].filter(x => x !== name) || null;            
        }
        return null;
    }
    public getFatherName(name: string) {
        const mother = this.getMotherName(name);
        return mother ? this.getSpouseName(mother) : null;
    }
    public getSpouseName(name: string) {
        let couple = this.coupleList.filter(x => x.indexOf(name) > -1)[0] || null;
        if (couple) {
            return name === couple[0] ? couple[1] : couple[0];
        }
        return null;
    }

    // returns mother of the child, null otherwise
    public getMotherName(name: string) {
        for (let mother in this.childList) {
            if (this.childList[mother].indexOf(name) > -1) {
                return mother;
            }
        }

        return null;
    }
}