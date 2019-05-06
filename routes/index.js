'use strict';
var express = require('express');
var router = express.Router();
var MerqueoDal = require('../code/dal/MerqueoDAL');

MerqueoDal.init();

router.get('/', async function (req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/req1', async function (req, res) {
    var datos = await MerqueoDal.get_products_inventory();
    res.json({datos});
});

router.get('/req2', async function (req, res) {
    var datos = await MerqueoDal.get_orders_to_attend();
    res.json({ datos });
});

router.get('/req3', async function (req, res) {
    var datos = await MerqueoDal.get_less_sold_products();
    res.json({ datos });
});

router.get('/req4/:order_id', async function (req, res) {
    var datos = await MerqueoDal.get_status_order_products({order_id: req.params.order_id});
    res.json({ datos });
});

router.get('/req5', async function (req, res) {
    var datos = await MerqueoDal.get_future_inventory();
    res.json({ datos });
});

router.get('/req6', async function (req, res) {
    var datos = await MerqueoDal.get_most_sold_products();
    res.json({ datos });
});

module.exports = router;
