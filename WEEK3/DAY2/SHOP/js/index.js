var shopRender = (function () {
    var productData = null;
    var listBox = document.getElementById('list'),
        linkList = document.getElementById('header').getElementsByTagName('a');

    //=>getData：获取数据
    var getData = function () {
        var xhr = new XMLHttpRequest();
        xhr.open('get', 'json/product.json', false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var result = xhr.responseText;
                productData = utils.toJSON(result);
            }
        };
        xhr.send(null);
    };

    //=>bindHTML：把数据动态绑定在页面中
    var bindHTML = function () {
        if (!productData) return;
        var str = ``;
        for (var i = 0; i < productData.length; i++) {
            var item = productData[i];
            str += `<li data-time="${item.time}" data-price="${item.price}" data-hot="${item.hot}">
            <a href="javascript:;">
                <img src="${item.img}" alt="">
                <p>${item.title}</p>
                <span>￥${item.price}</span>
            </a></li>`;
        }
        listBox.innerHTML = str;
    };

    //=>change：实现商品排序
    var change = function () {
        var oList = listBox.getElementsByTagName('li');
        oList = utils.toArray(oList);

        var _this = this,
            index = _this.myIndex,
            method = _this.myMethod;

        for (var k = 0; k < linkList.length; k++) {
            if (k !== index) {
                linkList[k].myMethod = -1;
            }
        }

        var attrAry = ['data-time', 'data-price', 'data-hot'],
            attr = attrAry[index];
        oList.sort(function (cur, next) {
            var curInn = cur.getAttribute(attr),
                nextInn = next.getAttribute(attr);
            if (index === 0) {
                curInn = curInn.replace(/-/g, '');
                nextInn = nextInn.replace(/-/g, '');
            }
            return (curInn - nextInn) * method;
        });

        var frg = document.createDocumentFragment();
        for (var i = 0; i < oList.length; i++) {
            frg.appendChild(oList[i]);
        }
        listBox.appendChild(frg);
        frg = null;
    };

    //=>bindEvent：绑定点击事件,点击实现排序
    var bindEvent = function () {
        for (var i = 0; i < linkList.length; i++) {
            var curLink = linkList[i];
            curLink.myMethod = -1;
            curLink.myIndex = i;
            curLink.onclick = function () {
                //=>this:curLink
                this.myMethod *= -1;
                change.call(this);
            }
        }
    };

    return {
        //=>init:当前模块唯一的入口,想要实现商品排序,我们需要做好多事情(执行很多方法),当别人执行shopRender.init()的时候,我们在这个方法中协调管控,让哪些方法先执行,哪些功能方法后执行；“init相当于模块的大脑，在这个方法中，我们需要规划出当前版块各功能方法的执行顺序，相当于打仗时候的司令员，它负责发布一项项的命令，我们这种模式叫做：基于单例模式的命令模式”
        init: function () {
            getData();
            bindHTML();
            bindEvent();
        }
    }
})();
shopRender.init();