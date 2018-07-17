new Vue({
	el:'#app',
	data:{
		//购物车中的数据
		shopList:[],
		shopseletedAll:false,
		allPrice:0
	},
	//组件已经加载完毕，请求网络数据，业务处理
	mounted(){
		//请求本地的数据
		this.getLocalData();	
	},
	//过滤器
	filters:{
		moneyFormat(money){
			return '￥'+money.toFixed(2);
		}
	},
	methods:{
		//请求本地的数据
		getLocalData(){
		  // GET /someUrl
		  this.$http.get('data/cart.json').then(response => {
		    const res= response.body;
		    this.shopList=res.allShops.shopList;
		  }, response => {
		    // error callback
		    alert("数据请求失败！");
		  });
		},
		//单件物品数量处理
		shopItemPrice(shopItem,flag){
			if(flag){
				shopItem.shopNumber=shopItem.shopNumber+=1
			}else{
				if(shopItem.shopNumber>0)
				shopItem.shopNumber=shopItem.shopNumber-=1
			}
			this.accountPrice();
		},
		//全选
		selectedAll(){
			this.shopseletedAll=!this.shopseletedAll;
			this.shopList.forEach((val,index)=>{
				if(typeof val.itemChecked=="undefined") {//val.itemChecked==undefined
					this.$set(val,"itemChecked",this.shopseletedAll);
				}else{
					val.itemChecked=this.shopseletedAll
				}
			})
			this.accountPrice();

		},
		//计算总价
		accountPrice(){
			let allPrice=0;
			this.shopList.forEach((val,index)=>{
					if(val.itemChecked) {
						allPrice += val.shopNumber * val.shopPrice;
					}
			})
			this.allPrice=allPrice;
		},
		//商品单选框
		selectedItem(shopItem,index){
			if(typeof shopItem.itemChecked=="undefined") {
				this.$set(shopItem,"itemChecked",!this.shopseletedAll);
			}else{
				shopItem.itemChecked=!shopItem.itemChecked;
			}
			//是否全部选中
			//出错点事件
			let flag=false;//(PS:出错点)flag=true
			this.shopList.forEach((val,index)=>{
				if(!val.itemChecked){//只要有一个商品没有被选，就改全选的状态
					flag=true;// flag=false
				}
			})
			//if(flag==true){
				this.shopseletedAll=!flag;// =flag 初始值设置有误
			//}
			this.accountPrice();
		},
		delItem(shop,index){
			debugger;
			this.shopList.splice(index,1);
			this.accountPrice();
		}
	}
})