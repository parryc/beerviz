//Parry Cadwallader
//github.com/parryc
(function (root){
  function colorscale(){
    return {
      create: function(data, name) {
        root.colorscale[name] =
          {
            data: [],
            options: {output: 'rgb'},
            set: function(data){
              var tempData = [];

              //Check if tinycolor is being used
              if(window.tinycolor) {
                data.forEach(function(v,i){
                  tempData.push({value: v.value, color: tinycolor(v.color).toRgb()});
                });
                data = tempData;
              } else {
                //Check to make sure that there's a transparency value
                data.forEach(function(v,i){
                  if(!v.color.a)
                    data[i].color.a = 1;
                  if(!v.color.hasOwnProperty("r") && v.color.hasOwnProperty("b") && v.color.hasOwnProperty("g"))
                    console.log("Your input data for "+name+" is poorly formatted.  Please check that each color object contains an 'r', 'b', and 'g' value. Otherwise, consider loading tinycolor.js.");
                });
              }
              this.data = data;
            },
            interp: function(c1,c2,per){
              var r = c1.r + (per*(c2.r-c1.r)),
                g = c1.g + (per*(c2.g-c1.g)),
                b = c1.b + (per*(c2.b-c1.b)),
                a = c1.a + (per*(c2.a-c1.a));
              return this.output({r:r,b:b,g:g,a:a});
            },
            output: function(color){
              var output = this.options.output;
              //Only option if not using TinyColor
              if(!output || output === 'rgb') {
                if(color.a != 1)
                  return 'rgba('+Math.round(color.r)+','+Math.round(color.g)+','+Math.round(color.b)+','+color.a+')';
                else
                  return 'rgb('+Math.round(color.r)+','+Math.round(color.g)+','+Math.round(color.b)+')';
              }
              if(output === 'hex')
                return tinycolor(color).toHexString();
              if(output === 'hsl')
                return tinycolor(color).toHslString();
              if(output === 'hsv')
                return tinycolor(color).toHsvString();
            },
            pick: function(point){
              var data = this.data,
                min = data[0].value,
                minColor = data[0].color,
                max = data[1].value,
                maxColor = data[1].color,
                windowMin, windowMax;

              //Find which two colors to interpolate between
              for(var i = 0; i < data.length-1; i++){
                windowMin = data[i].value;
                windowMax = data[i+1].value;

                if(windowMin <= point && point <= windowMax) {
                  min = data[i].value;
                  minColor = data[i].color;
                  max = data[i+1].value;
                  maxColor = data[i+1].color;
                }
              }
              return this.interp(minColor,maxColor,((point-min)/(max-min)));
            },
            setOutput: function(output){
              if(window.tinycolor)
                this.options.output = output;
              else
                console.log("TinyColor not installed, only RGB(a) available as output");
            }
          }
        root.colorscale[name].set(data);
      }
    }
  };
  
  //export to window
  root.colorscale = colorscale();
})(this);