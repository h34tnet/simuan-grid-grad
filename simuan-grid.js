
// not really random, since it's intialized with average color values
function generateRandomPolyCollection(isize, res, ctxInit) {
    var 
		size = Math.floor(isize / res),
        pts = [],
        col = [],
        resh = Math.floor(res/2),
        div = resh*(resh+1);
		
	var idata = ctxInit.getImageData(0, 0, 256, 256).data;

    // create the points
    for (var y=0; y<size+1; y++) {
        pts[y] = [];
        for (var x=0; x<size+1; x++) {
            pts[y][x] = {y:y*res, x:x*res, c: 0};
        }
    }

    // loop over all rectangles and get the avg color
    for (var y=0; y<size; y++) {
        for (var x=0; x<size; x++) {

            var qx = x*res, qy = y*res;

            // the inner loops collect the average 
            // color of the underlying pixels
			var 
                ic = [{r: 0, g: 0, b: 0},{r: 0, g: 0, b: 0},{r: 0, g: 0, b: 0},{r: 0, g: 0, b: 0},{r: 0, g: 0, b: 0}];

            // upper triangle
			for (var iy = 0; iy<resh; iy++) {
				for (var ix = iy; ix<res-iy; ix++) {
					var pos = ((qy+iy) * isize + (qx+ix))*4;
                        ic[0].r += idata[pos+0];
                        ic[0].g += idata[pos+1];
                        ic[0].b += idata[pos+2];
				}
			}

            // right triangle
            for (var ix = resh; ix<res; ix++) {
			    for (var iy = res-ix-1; iy<ix+1; iy++) {
					var pos = ((qy+iy) * isize + (qx+ix))*4;
                        ic[1].r += idata[pos+0];
                        ic[1].g += idata[pos+1];
                        ic[1].b += idata[pos+2];
				}
			}

            // lower triangle
			for (var iy = resh; iy<res; iy++) {
				for (var ix = res-iy-1; ix<iy+1; ix++) {
					var pos = ((qy+iy) * isize + (qx+ix))*4;
                        ic[2].r += idata[pos+0];
                        ic[2].g += idata[pos+1];
                        ic[2].b += idata[pos+2];
				}
			}

            // left triangle
            for (var ix = 0; ix<resh; ix++) {
			    for (var iy = ix; iy<res-ix; iy++) {
					var pos = ((qy+iy) * isize + (qx+ix))*4;
                        ic[3].r += idata[pos+0];
                        ic[3].g += idata[pos+1];
                        ic[3].b += idata[pos+2];
				}
			}

            // center
            for (var iy=resh-1; iy<resh+2; iy++) {
                for (var ix=resh-1; ix<resh+2; ix++) {
                    var pos = ((qy+iy) * isize + (qx+ix))*4;

                    ic[4].r += idata[pos+0]/9;
                    ic[4].g += idata[pos+1]/9;
                    ic[4].b += idata[pos+2]/9;
                }
            }

            // 8 colors: 4 triangles with 2 gradients each
            // the center gradient is the same for all
            for (var i=0; i<4; i++) {
                col.push({
                    r: ic[i].r / div,
                    g: ic[i].g / div,
                    b: ic[i].b / div,
                    c: 0
                });

                col.push({
                    r: ic[4].r,
                    g: ic[4].g,
                    b: ic[4].b,
                    c: 0
                });
            }
        }
    }

    return {
        pts: pts,
        col: col
    };
}

// draws the polygon collection to a canvas
function drawPolyCollection(ctx, polycol) {
    var size     = polycol.pts.length-1,
        colIndex = 0,
        pts      = polycol.pts;

    for (var y=0; y<size; y++) {
        for (var x=0; x<size; x++) {
            // draw the first triangle
            var lu = pts[y][x],
                ru = pts[y][x+1],
                ll = pts[y+1][x],
                rl = pts[y+1][x+1],
                cx =  (pts[y][x].x + pts[y+1][x+1].x)/2,
                cy =  (pts[y][x].y + pts[y+1][x+1].y)/2,

                lmx = (pts[y][x].x + pts[y+1][x].x)/2,
                lmy = (pts[y][x].y + pts[y+1][x].y)/2,

                rmx = (pts[y][x+1].x + pts[y+1][x+1].x)/2,
                rmy = (pts[y][x+1].y + pts[y+1][x+1].y)/2,

                umx = (pts[y][x].x + pts[y][x+1].x)/2,
                umy = (pts[y][x].y + pts[y][x+1].y)/2,

                dmx = (pts[y+1][x].x + pts[y+1][x+1].x)/2,
                dmy = (pts[y+1][x].y + pts[y+1][x+1].y)/2,
                
                c11 = polycol.col[colIndex+0], c11rgb = 'rgb(' + [c11.r, c11.g, c11.b].map(Math.floor).join(',') + ')',
                c12 = polycol.col[colIndex+1], c12rgb = 'rgb(' + [c12.r, c12.g, c12.b].map(Math.floor).join(',') + ')'
                c21 = polycol.col[colIndex+2], c21rgb = 'rgb(' + [c21.r, c21.g, c21.b].map(Math.floor).join(',') + ')',
                c22 = polycol.col[colIndex+3], c22rgb = 'rgb(' + [c22.r, c22.g, c22.b].map(Math.floor).join(',') + ')'
                c31 = polycol.col[colIndex+4], c31rgb = 'rgb(' + [c31.r, c31.g, c31.b].map(Math.floor).join(',') + ')',
                c32 = polycol.col[colIndex+5], c32rgb = 'rgb(' + [c32.r, c32.g, c32.b].map(Math.floor).join(',') + ')'
                c41 = polycol.col[colIndex+6], c41rgb = 'rgb(' + [c41.r, c41.g, c41.b].map(Math.floor).join(',') + ')',
                c42 = polycol.col[colIndex+7], c42rgb = 'rgb(' + [c42.r, c42.g, c42.b].map(Math.floor).join(',') + ')'

                lg1 = ctx.createLinearGradient(umx, umy, cx, cy),
                lg2 = ctx.createLinearGradient(rmx, rmy, cx, cy),
                lg3 = ctx.createLinearGradient(dmx, dmy, cx, cy),
                lg4 = ctx.createLinearGradient(lmx, lmy, cx, cy);

            lg1.addColorStop(0, c11rgb); lg1.addColorStop(1, c12rgb);
            lg2.addColorStop(0, c21rgb); lg2.addColorStop(1, c22rgb);
            lg3.addColorStop(0, c31rgb); lg3.addColorStop(1, c32rgb);
            lg4.addColorStop(0, c41rgb); lg4.addColorStop(1, c42rgb);

            // draw upper triangle 
            ctx.fillStyle = lg1;
            ctx.beginPath();
            ctx.moveTo(lu.x, lu.y);
            ctx.lineTo(ru.x, ru.y);
            ctx.lineTo(cx, cy);
            ctx.lineTo(lu.x, lu.y);
            ctx.fill();

            // draw right triangle
            ctx.fillStyle = lg2;
            ctx.beginPath();
            ctx.moveTo(ru.x, ru.y);
            ctx.lineTo(rl.x, rl.y);
            ctx.lineTo(cx, cy);
            ctx.lineTo(ru.x, ru.y);
            ctx.fill();

            // draw lower triangle
            ctx.fillStyle = lg3;
            ctx.beginPath();
            ctx.moveTo(rl.x, rl.y);
            ctx.lineTo(ll.x, ll.y);
            ctx.lineTo(cx, cy);
            ctx.lineTo(rl.x, rl.y);
            ctx.fill();

            // draw left triangle
            ctx.fillStyle = lg4;
            ctx.beginPath();
            ctx.moveTo(ll.x, ll.y);
            ctx.lineTo(lu.x, lu.y);
            ctx.lineTo(cx, cy);
            ctx.lineTo(ll.x, ll.y);
            ctx.fill();

            colIndex += 8;

        }
    }
}

// draws the polygon collection to a canvas, but not filled - only lines
// used for visualisation/debugging
function drawPolyCollectionDebGrid(ctx, polycol) {
    var size = polycol.pts.length,
        pts  = polycol.pts;

    ctx.strokeStyle = '#333333';
    ctx.lineWidth   = 1;  
    ctx.clearRect(0, 0, 255, 255);

    for (var y=0; y<size-1; y++) {
        for (var x=0; x<size-1; x++) {
            ctx.beginPath();
            ctx.moveTo(Math.floor(pts[y][x].x)+.5,     Math.floor(pts[y][x].y)+.5);
            ctx.lineTo(Math.floor(pts[y][x+1].x)+.5,   Math.floor(pts[y][x+1].y)+.5);
            ctx.lineTo(Math.floor(pts[y+1][x+1].x)+.5, Math.floor(pts[y+1][x+1].y)+.5);
            ctx.lineTo(Math.floor(pts[y+1][x].x)+.5,   Math.floor(pts[y+1][x].y)+.5);
            ctx.lineTo(Math.floor(pts[y][x].x)+.5,     Math.floor(pts[y][x].y)+.5);
            ctx.strokeStyle = '#333333';
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(Math.floor(pts[y][x].x)+.5,     Math.floor(pts[y][x].y)+.5);
            ctx.lineTo(Math.floor(pts[y+1][x+1].x)+.5,     Math.floor(pts[y+1][x+1].y)+.5);
            ctx.strokeStyle = '#CCCCCC';
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(Math.floor(pts[y][x+1].x)+.5,     Math.floor(pts[y][x+1].y)+.5);
            ctx.lineTo(Math.floor(pts[y+1][x].x)+.5,     Math.floor(pts[y+1][x].y)+.5);
            ctx.strokeStyle = '#CCCCCC';
            ctx.stroke();

            var c = pts[y][x].c, c2 = pts[y][x].c/2;
            ctx.fillStyle = 'rgb(255, 0, 0);';
            ctx.fillRect(pts[y][x].x-c2, pts[y][x].y-c2, c, c);
        }
    }
}

// clone (aka deep copy) a polygoncollection
function clone(polycol) {
    var 
        npoly = {pts: [], col: []}
        opts = polycol.pts,
        wx = opts[0].length,
        wy = opts.length;

    // copy points
    for (var y=0; y<wy; y++) {
        npoly.pts[y] = [];

        for (var x=0; x<wx; x++) {
            npoly.pts[y][x] = {
                x: opts[y][x].x,
                y: opts[y][x].y,
                c: opts[y][x].c
            }
        }
    }
	
    // copy colors
    for (var i=0, l = polycol.col.length; i<l; i++) {
        var c = polycol.col[i];
        npoly.col.push({
            r: c.r,
            g: c.g,
            b: c.b,
            c: c.c
        });
    }
	
    return npoly;
}


// moves one point slightly
// points with a better track record get chosen more often
function mutatePolyCollectionPoints(pc, mf) {
	var 
        pts = pc.pts,
		w   = pts.length,
        // only change points which are not at the border
		mtx = Math.floor(Math.random() * (w-2))+1,
		mty = Math.floor(Math.random() * (w-2))+1,
		pt  = pts[mty][mtx],
		mfh = mf/2,
        // total score
        sct = 0;
    
    for (var y=1; y<w-1; y++)
        for (var x=1; x<w-1; x++)
            sct += Math.floor(pts[y][x].c)+1;

    var rpos = Math.random()*sct;

    var tc = 0;

    for (var y=1; y<w-1; y++) {
        for (var x=1; x<w-1; x++) {
            var pt = pts[y][x];
            for (var i=0; i<pt.c+1; i++) {
                tc += 1;
                if (tc >= rpos) {
                	pt.x += Math.random()*mf-mfh;
                	pt.y += Math.random()*mf-mfh;
                    return {y:y, x:x};
                }
            }
        }
    }
	
	// pt.x += Math.random()*mf-mfh;
	// pt.y += Math.random()*mf-mfh;

    console.log('this should never happen: randomizer didn\'t find a suitable point');
    throw 'noooo!';
    return null;
}


// changes one color slightly
// @todo: ranking of colors
function mutatePolyCollectionColors(pc, mf) {
	var cols = pc.col,
        cl = cols.length,
        p = Math.floor(Math.random() * pc.col.length),
		c = pc.col[p],
        mfh = mf/2,
        r = Math.floor(Math.random() * 3),
        sct = 0;

    for (var i=0; i<cl; i++)
        sct += cols[i].c+1;

    var rpos = Math.random() * sct, tc = 0;

    for (var i=0; i<cl; i++) {
        for (var j=0; j<cols[i].c+1; j++) {
            tc += 1;
            if (tc >= rpos) {
                switch (r) {
                    case 0:
                        pc.col[i] = {
                            r: Math.max(0, Math.min(255, c.r + Math.random()*mf-mfh)),
                            g: c.g,
                            b: c.b,
                            c: c.c
                        }; break;
                    case 1:
                        pc.col[i] = {
                            r: c.r,
                            g: Math.max(0, Math.min(255, c.g + Math.random()*mf-mfh)),
                            b: c.b,
                            c: c.c
                        }; break;
                    case 2:
                        pc.col[i] = {
                            r: c.r,
                            g: c.g,
                            b: Math.max(0, Math.min(255, c.b + Math.random()*mf-mfh)),
                            c: c.c
                        };
                }

                return i;
            }
        }
    }

    console.log(tc, i, j);

    console.log('this should never happen: randomizer didn\'t find a suitable color');
    throw 'noooo!';
    return null;
}


// get fitness (must be drawn to work)
function getFitness(ctx, img, octx) {
    drawPolyCollection(ctx, img);
    return compareImages(ctx, octx);
}


// compare images byte for byte
// returns the added difference between every channel (save alpha) for the RGB
// for every single pixel
function compareImages(ctx1, ctx2) {
    var d   = 0;
    var id1 = ctx1.getImageData(0, 0, 256, 256);
    var id2 = ctx2.getImageData(0, 0, 256, 256);
    var l   = id1.data.length;

    for (var i=0; i<l; i += 4) {
        d += Math.abs(id1.data[i]   - id2.data[i]) +
             Math.abs(id1.data[i+1] - id2.data[i+1]) +
             Math.abs(id1.data[i+2] - id2.data[i+2]);
    }
    
    return d;
}
