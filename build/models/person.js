"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FamilyManager = void 0;
var FamilyManager = /** @class */ (function () {
    function FamilyManager() {
        this.initFamily();
    }
    FamilyManager.prototype.initFamily = function () {
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
    };
    FamilyManager.prototype.addChild = function (motherName, childName, gender) {
        var shortGender = gender === 'Male' ? 'm' : 'f';
        if (motherName in this.childList) {
            this.genderList[childName] = shortGender;
            this.childList[motherName].push(childName);
            return "CHILD_ADDITION_SUCCEEDED";
        }
        else if (motherName in this.genderList) {
            return "CHILD_ADDITION_FAILED";
        }
        return "PERSON_NOT_FOUND";
    };
    //GET_RELATIONSHIP handler
    FamilyManager.prototype.getRelationship = function (name, relation) {
        var methodName = "get" + relation.replace(/-/g, '');
        var isDefined = this[methodName];
        if (!isDefined) {
            return "Unknown or invalid relation: " + relation;
        }
        if (!this.genderList[name]) {
            return "PERSON_NOT_FOUND";
        }
        var result = this[methodName](name);
        if (result === null || result.length === 0) {
            return "NONE";
        }
        return result.join(' ');
    };
    // spouse's brothers + sisters' husbands
    FamilyManager.prototype.getBrotherInLaw = function (name) {
        var _this = this;
        var spouse = this.getSpouseName(name);
        var spouseBrothers = spouse ? this.getBrothers(spouse) || [] : [];
        var sisters = this.getSisters(name);
        var sisterHusbands = [];
        if (sisters) {
            sisters.forEach(function (bro) {
                var sisHubby = _this.getSpouseName(bro);
                if (sisHubby)
                    sisterHusbands.push(sisHubby);
            });
        }
        return __spreadArrays(spouseBrothers, sisterHusbands);
    };
    // spouse's sisters + brothers' wives
    FamilyManager.prototype.getSisterInLaw = function (name) {
        var _this = this;
        var spouse = this.getSpouseName(name);
        var spouseSisters = spouse ? this.getSisters(spouse) || [] : [];
        var brothers = this.getBrothers(name);
        var brotherWives = [];
        if (brothers) {
            brothers.forEach(function (bro) {
                var broWife = _this.getSpouseName(bro);
                if (broWife)
                    brotherWives.push(broWife);
            });
        }
        return __spreadArrays(spouseSisters, brotherWives);
    };
    // mother's sisters
    FamilyManager.prototype.getMaternalAunt = function (name) {
        var mother = this.getMotherName(name);
        if (mother) {
            return this.getSisters(mother);
        }
        return null;
    };
    // father's sisters
    FamilyManager.prototype.getPaternalAunt = function (name) {
        var father = this.getFatherName(name);
        if (father) {
            return this.getSisters(father);
        }
        return null;
    };
    // mother's brothers
    FamilyManager.prototype.getMaternalUncle = function (name) {
        var mother = this.getMotherName(name);
        if (mother) {
            return this.getBrothers(mother);
        }
        return null;
    };
    // father's brothers
    FamilyManager.prototype.getPaternalUncle = function (name) {
        var father = this.getFatherName(name);
        if (father) {
            return this.getBrothers(father);
        }
        return null;
    };
    FamilyManager.prototype.getDaughter = function (name) {
        var _this = this;
        var children = this.getChildren(name);
        return children ? children.filter(function (x) { return _this.genderList[x] === 'f'; }) : null;
    };
    FamilyManager.prototype.getSon = function (name) {
        var _this = this;
        var children = this.getChildren(name);
        return children ? children.filter(function (x) { return _this.genderList[x] === 'm'; }) : null;
    };
    FamilyManager.prototype.getChildren = function (name) {
        name = this.genderList[name] === 'f' ? name : this.getSpouseName(name) || "";
        var children = name.length > 0 ? this.childList[name] : null;
        return children;
    };
    FamilyManager.prototype.getSisters = function (name) {
        var _this = this;
        var siblings = this.getSiblings(name);
        return siblings ? siblings.filter(function (x) { return _this.genderList[x] === 'f'; }) : null;
    };
    FamilyManager.prototype.getBrothers = function (name) {
        var _this = this;
        var siblings = this.getSiblings(name);
        return siblings ? siblings.filter(function (x) { return _this.genderList[x] === 'm'; }) : null;
    };
    FamilyManager.prototype.getSiblings = function (name) {
        var mother = this.getMotherName(name);
        if (mother) {
            return this.childList[mother].filter(function (x) { return x !== name; }) || null;
        }
        return null;
    };
    FamilyManager.prototype.getFatherName = function (name) {
        var mother = this.getMotherName(name);
        return mother ? this.getSpouseName(mother) : null;
    };
    FamilyManager.prototype.getSpouseName = function (name) {
        var couple = this.coupleList.filter(function (x) { return x.indexOf(name) > -1; })[0] || null;
        if (couple) {
            return name === couple[0] ? couple[1] : couple[0];
        }
        return null;
    };
    // returns mother of the child, null otherwise
    FamilyManager.prototype.getMotherName = function (name) {
        for (var mother in this.childList) {
            if (this.childList[mother].indexOf(name) > -1) {
                return mother;
            }
        }
        return null;
    };
    return FamilyManager;
}());
exports.FamilyManager = FamilyManager;
