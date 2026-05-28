const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newData = `res.json({ success: true, data: [
      { 
        id: 1, symbol: 'sh601138', name: '工业富联', type: '涨停', reason: '日收盘价格涨幅偏离值达到7%', 
        sectors: ['AI服务器', '算力', '英伟达产业链'],
        instNetBuy: 185000, hotMoneyNetBuy: 95000, focus: true, focusReason: '机构与外资共振抢筹，算力核心龙头资金抱团持续',
        buySeats: [{name: '沪股通专用', amount: 155000}, {name: '机构专用', amount: 65000}, {name: '机构专用', amount: 45000}, {name: '招商证券深圳深南东路', amount: 35000}, {name: '中信证券北京总部', amount: 28000}], 
        sellSeats: [{name: '沪股通专用', amount: 45000}, {name: '机构专用', amount: 25000}, {name: '东方财富拉萨团结路', amount: 12000}, {name: '东方财富拉萨东环路', amount: 8000}, {name: '中信建投北京东直门', amount: 5000}] 
      },
      { 
        id: 2, symbol: 'sz002897', name: '意华股份', type: '涨停', reason: '连续三个交易日内，涨幅偏离值累计达20%', 
        sectors: ['高速连接器', 'CPO', '华为汽车'],
        instNetBuy: 42000, hotMoneyNetBuy: 55000, focus: true, focusReason: '顶级游资接力，机构锁仓，高速连接器概念发酵',
        buySeats: [{name: '国泰君安上海江苏路', amount: 32000}, {name: '机构专用', amount: 25000}, {name: '深股通专用', amount: 18000}, {name: '华泰证券深圳益田路', amount: 15000}, {name: '机构专用', amount: 8000}], 
        sellSeats: [{name: '深股通专用', amount: 15000}, {name: '东方财富拉萨天苑路', amount: 11000}, {name: '机构专用', amount: 5000}, {name: '平安证券深圳深南东路', amount: 4500}, {name: '中信证券上海紫竹高新区', amount: 3200}] 
      },
      { 
        id: 3, symbol: 'sz300308', name: '中际旭创', type: '异常波动', reason: '日收盘价格涨幅偏离值累计达到7%', 
        sectors: ['CPO', '光通信', 'AI算力'],
        instNetBuy: 250000, hotMoneyNetBuy: 45000, focus: true, focusReason: '外资与内资机构天量买入，业绩确定性获主流资金认可',
        buySeats: [{name: '深股通专用', amount: 210000}, {name: '机构专用', amount: 58000}, {name: '机构专用', amount: 42000}, {name: '机构专用', amount: 35000}, {name: '中金公司上海分公司', amount: 25000}], 
        sellSeats: [{name: '深股通专用', amount: 95000}, {name: '机构专用', amount: 35000}, {name: '招商证券深圳深南东路', amount: 18000}, {name: '国盛证券宁波桑田路', amount: 12000}, {name: '东方财富拉萨团结路', amount: 8500}] 
      },
      { 
        id: 4, symbol: 'sh600690', name: '海尔智家', type: '跌停', reason: '日跌幅偏离值达到7%', 
        sectors: ['家电', '出海', '消费白马'],
        instNetBuy: -155000, hotMoneyNetBuy: -12000, focus: false,
        buySeats: [{name: '沪股通专用', amount: 45000}, {name: '东方财富拉萨团结路', amount: 11000}, {name: '中金公司上海分公司', amount: 8000}], 
        sellSeats: [{name: '沪股通专用', amount: 115000}, {name: '机构专用', amount: 52000}, {name: '机构专用', amount: 38000}] 
      },
      { 
        id: 5, symbol: 'sz300502', name: '新易盛', type: '异常波动', reason: '日换手率达到20%', 
        sectors: ['CPO', '光通信', '云计算'],
        instNetBuy: 85000, hotMoneyNetBuy: -21000, focus: false,
        buySeats: [{name: '深股通专用', amount: 65000}, {name: '机构专用', amount: 35000}, {name: '机构专用', amount: 15000}], 
        sellSeats: [{name: '深股通专用', amount: 45000}, {name: '东方财富拉萨东环路', amount: 15000}, {name: '国泰君安上海江苏路', amount: 12000}] 
      },
      { 
        id: 6, symbol: 'sh600839', name: '四川长虹', type: '涨停', reason: '连续三个交易日内，涨幅偏离值累计达20%', 
        sectors: ['低空经济', '算力', '华为生态'],
        instNetBuy: -12000, hotMoneyNetBuy: 185000, focus: true, focusReason: '一线游资抱团接力，高标换手龙头特征明显',
        buySeats: [{name: '国盛证券宁波桑田路', amount: 65000}, {name: '华泰证券北京雍和宫', amount: 55000}, {name: '银河证券北京中关村大街', amount: 45000}, {name: '中信证券上海溧阳路', amount: 35000}, {name: '东方财富拉萨团结路', amount: 15000}], 
        sellSeats: [{name: '机构专用', amount: 35000}, {name: '国泰君安上海新闸路', amount: 28000}, {name: '招商证券福州六一中路', amount: 22000}, {name: '东方财富拉萨团结路', amount: 18000}, {name: '中信建投杭州庆春路', amount: 15000}] 
      }
    ] });`;

const oldDataRegex = /res\.json\(\{\s*success:\s*true,\s*data:\s*\[[\s\S]*?\]\s*\}\);/m;

if (code.match(oldDataRegex)) {
  code = code.replace(oldDataRegex, newData);
  fs.writeFileSync('server.ts', code);
  console.log('Successfully updated dragon data in server.ts');
} else {
  console.log('Could not find dragon data to replace');
}
