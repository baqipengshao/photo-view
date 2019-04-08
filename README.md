# photo-view
基于jquery图片查看, 拖动, 放大

1.html 结构如下：

    <div class="demo">
        <ul>
            <li class="img" img-url="img/1-b.jpg"><img src="img/1-m.jpg" style="width:100px;"></li>
            <li class="img" img-url="img/2-b.jpg"><img src="img/2-m.jpg" style="width:100px;"></li>
            <li class="img" img-url="img/3-b.jpg"><img src="img/3-m.jpg" style="width:100px;"></li>
            <li class="img" img-url="img/4-b.jpg"><img src="img/4-m.jpg" style="width:100px;"></li>
            <li class="img" img-url="img/5.png"><img src="img/5.png" style="width:100px;"></li>
        </ul>
    </div>
    
 2.需要引用的js
 
    <script src="js/jquery.min.js" type="text/javascript"></script>
    <script src="js/jquery.mousewheel.min.js"></script>
    <script src="js/photo-view-1.5.js"></script>
    
    <script>
    $(document).ready(function() {
        $('.img').photoView({
            rate: 0.2 //缩放倍数,移动端手势缩放不调用此参数
        });

    })

    </script>   
    


   缩略图包含属性:img-url,即原图地址, 如上 li 的父级 ul 中有5个子节点, 所以这5张图片将作为一组。
   缩略图可以用 li 或别的标签包裹，或者直接写成
   <div class="demo">
      <img class="img" img-url="图片地址" src="">
      ...
   </div>
   
  ps:
   class="img" 最好是block或inline-block, 否则点击缩略图时，图片动画可能不是从小图处出现的。
   
   demo: http://s1.jk390.com/photoview/demo.html

   
   
   

   
   
   
    
    
