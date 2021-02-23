"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FamilyManager = exports.Female = exports.Male = exports.Person = void 0;
var Person = /** @class */ (function () {
    function Person(name, gender) {
        this.name = name;
        this.gender = gender;
    }
    return Person;
}());
exports.Person = Person;
var Male = /** @class */ (function (_super) {
    __extends(Male, _super);
    function Male(name, spouse) {
        if (spouse === void 0) { spouse = null; }
        var _this = _super.call(this, name, 'm') || this;
        _this.spouse = spouse;
        return _this;
    }
    return Male;
}(Person));
exports.Male = Male;
var Female = /** @class */ (function (_super) {
    __extends(Female, _super);
    function Female(name, spouse, children) {
        if (children === void 0) { children = []; }
        var _this = _super.call(this, name, 'f') || this;
        _this.spouse = spouse;
        _this.children = children;
        return _this;
    }
    Female.prototype.addChild = function (person) {
        this.children.push(person);
    };
    return Female;
}(Person));
exports.Female = Female;
var FamilyManager = /** @class */ (function () {
    function FamilyManager() {
    }
    FamilyManager.prototype.initFamily = function () {
        this.king = new Male('Shan', new Female('Anga', null, []));
    };
    FamilyManager.prototype.getFamilyMember = function (name) {
        var member = this.iterateFamilyInner(name, this.king);
        return member;
    };
    FamilyManager.prototype.iterateFamilyInner = function (name, root) {
        var _this = this;
        var _a, _b, _c;
        if (root.name === name)
            return root;
        if (root instanceof Male) {
            if (((_a = root.spouse) === null || _a === void 0 ? void 0 : _a.name) === name)
                return root.spouse;
            if (((_b = root.spouse) === null || _b === void 0 ? void 0 : _b.children) && root.spouse.children.length > 0) {
                root.spouse.children.forEach(function (child) {
                    var member = _this.iterateFamilyInner(name, child);
                    if (member !== null)
                        return member;
                });
            }
        }
        else if (root instanceof Female) {
            if (((_c = root.spouse) === null || _c === void 0 ? void 0 : _c.name) === name)
                return root.spouse;
            if (root.children && root.children.length > 0) {
                root.children.forEach(function (child) {
                    var member = _this.iterateFamilyInner(name, child);
                    if (member !== null)
                        return member;
                });
            }
        }
        return null;
    };
    FamilyManager.prototype.addChildren = function (motherName, children) {
        var mother = this.getFamilyMember(motherName);
        if (mother && mother instanceof Female) {
            children.forEach(function (child) { return mother.children.push(child); });
        }
    };
    return FamilyManager;
}());
exports.FamilyManager = FamilyManager;
/*



*/ 
