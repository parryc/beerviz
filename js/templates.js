(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['beerlist'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n<li class=\"row-fluid beer\">\n  <div class=\"top\">\n    <span class=\"rating\" style=\"background: "
    + escapeExpression((helper = helpers.color || (depth0 && depth0.color),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.rating), options) : helperMissing.call(depth0, "color", (depth0 && depth0.rating), options)))
    + "\"><span class=\"hidden\">";
  if (helper = helpers.rating) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rating); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ".0</span>"
    + escapeExpression((helper = helpers.wordRating || (depth0 && depth0.wordRating),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.rating), options) : helperMissing.call(depth0, "wordRating", (depth0 && depth0.rating), options)))
    + "</span>\n    <img class=\"country-pic\" src=\"images/";
  if (helper = helpers.country) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.country); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ".png\" title=\"";
  if (helper = helpers.country) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.country); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"/><span class=\"hidden country\">";
  if (helper = helpers.country) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.country); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span> <span class=\"style\">";
  if (helper = helpers.style) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.style); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n  </div>\n  <div class=\"middle\">\n    <span class=\"brewery\">";
  if (helper = helpers.brewery) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.brewery); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span> <span class=\"name\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n  </div>\n  <div class=\"bottom\">\n    <span class=\"date-small\">";
  if (helper = helpers.drinkMonth) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.drinkMonth); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "/";
  if (helper = helpers.drinkYear) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.drinkYear); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span><span class=\"date\"><span class=\"hidden\">";
  if (helper = helpers.drinkYear) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.drinkYear); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "-";
  if (helper = helpers.drinkMonth) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.drinkMonth); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>"
    + escapeExpression((helper = helpers.date || (depth0 && depth0.date),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.drinkMonth), (depth0 && depth0.drinkYear), options) : helperMissing.call(depth0, "date", (depth0 && depth0.drinkMonth), (depth0 && depth0.drinkYear), options)))
    + "</span>\n    <span class=\"location\">\n      <span class=\"location-city\">";
  if (helper = helpers.drinkLocationCity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.drinkLocationCity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>,&nbsp;\n      <span class=\"location-country\">\n        ";
  if (helper = helpers.drinkLocationCountry) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.drinkLocationCountry); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n        <span class=\"hidden\">-";
  if (helper = helpers.drinkLocationCity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.drinkLocationCity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n      </span>\n    </span>\n  </div>\n</li>\n";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
})();