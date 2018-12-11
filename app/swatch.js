const getPixels=require("get-pixels");

class Swatch{
  static DEFAULT_DEPTH(){
    return 1;
  }
  static load(image){
    return new Promise(function(resolve,reject){
      getPixels(image,function(err,pixels){
        if(err) reject(err);
        else resolve(Swatch._convertPixelsToRGB(pixels));
      });
    });
  }

  static _convertPixelsToRGB(pixels){
    const width=pixels.shape[0];
    const height=pixels.shape[1];
    const rgbVals=[];
    for(let y=0;y<height;y++){
      for(let x=0;x<width;x++){
        const index=(y*width+x)*4;
        rgbVals.push({
          r:pixels.data[index],
          g:pixels.data[index+1],
          b:pixels.data[index+2]
        });
      }
    }
    return rgbVals;
  }

  static _findBiggestRange(rgbVals){
    let rMin=Number.POSITIVE_INFINITY;
    let rMax=Number.NEGATIVE_INFINITY;

    let gMin=Number.POSITIVE_INFINITY;
    let gMax=Number.NEGATIVE_INFINITY;

    let bMin=Number.POSITIVE_INFINITY;
    let bMax=Number.NEGATIVE_INFINITY;


    rgbVals.forEach(function(pixels){
      rMin=Math.min(rMin,pixels.r);
      rMax=Math.max(rMax,pixels.r);
      gMin=Math.min(gMin,pixels.g);
      gMax=Math.max(gMax,pixels.g);
      bMin=Math.min(bMin,pixels.b);
      bMax=Math.max(bMax,pixels.b);
    });

    const rRange=rMax-rMin;
    const gRange=gMax-gMin;
    const bRange=bMax-bMin;

    const biggestRange=Math.max(rRange,gRange,bRange);

    if(biggestRange==rRange){
      return "r";
    }else if(biggestRange==gRange){
      return "g";
    }else{
      return "b";
    }

  }

  static quantize(rgbVals,depth=0,maxDepth=Swatch.DEFAULT_DEPTH()){
    if(depth==0){
      console.log(`Quantizing ${Math.pow(2,maxDepth)} buckets`);
    }
    if(depth==maxDepth){
      const color=rgbVals.reduce(function(prev,curr){
        prev.r+=curr.r;
        prev.g+=curr.g;
        prev.b+=curr.b;
        return prev;
      },{
        r:0,
        g:0,
        b:0
      });

      color.r=Math.round(color.r/rgbVals.length);
      color.g=Math.round(color.g/rgbVals.length);
      color.b=Math.round(color.b/rgbVals.length);

      return [color];
    }

    const componentToSortBy=Swatch._findBiggestRange(rgbVals);
    rgbVals.sort(function(a,b){
      a[componentToSortBy]-b[componentToSortBy];
    });

    const mid=rgbVals.length/2;
    return [...Swatch.quantize(rgbVals.slice(0,mid),depth+1,maxDepth),
            ...Swatch.quantize(rgbVals.slice(mid+1),depth+1,maxDepth)];

  }

  static getQuantized(rgbVals){
      return new Promise(function(resolve,reject){
        resolve(Swatch.quantize(rgbVals));
      });
  }

  static orderByLuminance(rgbVals){
    const calcLuminance=function(p){
        return 0.2126*p.r + 0.7152*p.g + 0.0722*p.b;
    };

    return rgbVals.sort(function(a,b){
      return calcLuminance(a)-calcLuminance(b);
    });
  }

  static getOrderByLuminance(rgbVals){
    return new Promise(function(resolve,reject){
      resolve(Swatch.orderByLuminance(rgbVals));
    });
  }
}

module.exports=Swatch;
