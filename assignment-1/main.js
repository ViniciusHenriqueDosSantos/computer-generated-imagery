const canva= document.getElementsByTagName('canvas')[0]
canva.addEventListener('mousedown', function(event) {
    const rect = canva.getBoundingClientRect();
    const x_pixel = event.clientX - rect.left;
    const y_pixel = event.clientY - rect.top;

    let x_webgl = (x_pixel / canva.width) * 2.0 - 1.0;
    
    let y_webgl = (1.0 - (y_pixel / canva.height)) * 2.0 - 1.0; 

    x_webgl = Math.round(x_webgl * 10) / 10;
    y_webgl = Math.round(y_webgl * 10) / 10;

    console.log(`    ${x_webgl.toFixed(1)}, ${y_webgl.toFixed(1)},     1.0, 0.0, 0.0,`);
})

