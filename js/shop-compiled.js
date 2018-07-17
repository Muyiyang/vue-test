'use strict';

new Vue({
	el: '#app',
	data: {
		//购物车中的数据
		shopList: [],
		shopseletedAll: false,
		allPrice: 0
	},
	//组件已经加载完毕，请求网络数据，业务处理
	mounted: function mounted() {
		//请求本地的数据
		this.getLocalData();
	},
	//过滤器
	filters: {
		moneyFormat: function moneyFormat(money) {
			return '￥' + money.toFixed(2);
		}
	},
	methods: {
		//请求本地的数据
		getLocalData: function getLocalData() {
			var _this = this;

			// GET /someUrl
			this.$http.get('data/cart.json').then(function (response) {
				var res = response.body;
				_this.shopList = res.allShops.shopList;
			}, function (response) {
				// error callback
				alert("数据请求失败！");
			});
		},
		//单件物品数量处理
		shopItemPrice: function shopItemPrice(shopItem, flag) {
			if (flag) {
				shopItem.shopNumber = shopItem.shopNumber += 1;
			} else {
				if (shopItem.shopNumber > 0) shopItem.shopNumber = shopItem.shopNumber -= 1;
			}
			this.accountPrice();
		},
		//全选
		selectedAll: function selectedAll() {
			var _this2 = this;

			this.shopseletedAll = !this.shopseletedAll;
			this.shopList.forEach(function (val, index) {
				if (typeof val.itemChecked == "undefined") {
					//val.itemChecked==undefined
					_this2.$set(val, "itemChecked", _this2.shopseletedAll);
				} else {
					val.itemChecked = _this2.shopseletedAll;
				}
			});
			this.accountPrice();
		},
		//计算总价
		accountPrice: function accountPrice() {
			var allPrice = 0;
			this.shopList.forEach(function (val, index) {
				if (val.itemChecked) {
					allPrice += val.shopNumber * val.shopPrice;
				}
			});
			this.allPrice = allPrice;
		},
		//商品单选框
		selectedItem: function selectedItem(shopItem, index) {
			if (typeof shopItem.itemChecked == "undefined") {
				this.$set(shopItem, "itemChecked", !this.shopseletedAll);
			} else {
				shopItem.itemChecked = !shopItem.itemChecked;
			}
			//是否全部选中
			//出错点事件
			var flag = false; //(PS:出错点)flag=true
			this.shopList.forEach(function (val, index) {
				if (!val.itemChecked) {
					//只要有一个商品没有被选，就改全选的状态
					flag = true; // flag=false
				}
			});
			//if(flag==true){
			this.shopseletedAll = !flag; // =flag 初始值设置有误
			//}
			this.accountPrice();
		},
		delItem: function delItem(shop, index) {
			debugger;
			this.shopList.splice(index, 1);
			this.accountPrice();
		}
	}
});

//# sourceMappingURL=shop-compiled.js.map