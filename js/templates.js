(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['beerlist'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n<li class=\"row-fluid beer\">\r\n  <div class=\"span5\">\r\n    <span class=\"rating\" style=\"background-color: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.color || (depth0 && depth0.color)),stack1 ? stack1.call(depth0, (depth0 && depth0.rating), options) : helperMissing.call(depth0, "color", (depth0 && depth0.rating), options)))
    + "\"><span class=\"hidden\">";
  if (stack2 = helpers.rating) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.rating); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + ".0</span>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.wordRating || (depth0 && depth0.wordRating)),stack1 ? stack1.call(depth0, (depth0 && depth0.rating), options) : helperMissing.call(depth0, "wordRating", (depth0 && depth0.rating), options)))
    + "</span>\r\n    <span class=\"brewery\">";
  if (stack2 = helpers.brewery) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.brewery); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span> <span class=\"name\">";
  if (stack2 = helpers.name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.name); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span>\r\n  </div>\r\n  <div class=\"span3\">\r\n    <img class=\"country-pic\" src=\"images/";
  if (stack2 = helpers.country) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.country); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + ".png\" title=\"";
  if (stack2 = helpers.country) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.country); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\"/><span class=\"hidden country\">";
  if (stack2 = helpers.country) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.country); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span> <span class=\"style\">";
  if (stack2 = helpers.style) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.style); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span>\r\n  </div>\r\n  <div class=\"span4\">\r\n    <span class=\"date-small\">";
  if (stack2 = helpers.drinkMonth) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.drinkMonth); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "/";
  if (stack2 = helpers.drinkYear) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.drinkYear); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span><span class=\"date\"><span class=\"hidden\">";
  if (stack2 = helpers.drinkYear) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.drinkYear); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "-";
  if (stack2 = helpers.drinkMonth) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.drinkMonth); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.date || (depth0 && depth0.date)),stack1 ? stack1.call(depth0, (depth0 && depth0.drinkMonth), (depth0 && depth0.drinkYear), options) : helperMissing.call(depth0, "date", (depth0 && depth0.drinkMonth), (depth0 && depth0.drinkYear), options)))
    + "</span>\r\n    <span class=\"location\">\r\n      <span class=\"location-city\">";
  if (stack2 = helpers.drinkLocationCity) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.drinkLocationCity); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span>,&nbsp;\r\n      <span class=\"location-country\">\r\n        ";
  if (stack2 = helpers.drinkLocationCountry) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.drinkLocationCountry); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\r\n        <span class=\"hidden\">-";
  if (stack2 = helpers.drinkLocationCity) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.drinkLocationCity); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span>\r\n      </span>\r\n    </span>\r\n  </div>\r\n</li>\r\n";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  return buffer;
  });
})();