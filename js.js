document.getElementById('screenSizeBtn').addEventListener('click', function() {
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;
            
    alert(
      `Размеры экрана:\n\n` +
      `Общее разрешение: ${screenWidth} × ${screenHeight} пикселей\n` +
      `Область просмотра: ${innerWidth} × ${innerHeight} пикселей`
        );
  });
