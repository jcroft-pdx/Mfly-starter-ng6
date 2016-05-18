import angular from 'angular';
import ErrorHandler from './errorHandler/errorHandler';
import Navbar from './navbar/navbar';
import Hero from './hero/hero';
import User from './user/user';

export default angular.module('app.common', [
  ErrorHandler,
  Navbar,
  Hero,
  User
]).name;
