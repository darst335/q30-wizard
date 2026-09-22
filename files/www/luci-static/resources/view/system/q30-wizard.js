'use strict';
'require view';

// 菜单「快速设置向导」页面：内嵌向导 HTML（复用 /cgi-bin/wizard?op=page 输出）
// 之所以用 iframe 而不是把表单重写为 LuCI cbi 模型：向导需支持「完成即生效」
// 的一次性流程（含写 uci、重启 network、reload wifi），与 LuCI 的
// 保存/应用两段式模型不兼容，独立页面更可控，且与首启自动跳转共用同一套实现。

return view.extend({
	load: function() {
		return Promise.resolve();
	},

	render: function() {
		// 必须用绝对路径：L.url() 是相对 LuCI 挂载点(/cgi-bin/luci/)的，
		// 会拼出 /cgi-bin/luci/cgi-bin/wizard 导致 404
		var frame = E('iframe', {
			'id': 'q30-wizard-frame',
			'src': '/cgi-bin/wizard?op=page',
			'style': 'width:100%;min-height:900px;height:1120px;border:0;display:block;background:transparent',
			'frameborder': '0'
		});

		frame.addEventListener('load', function() {
			try {
				var d = frame.contentDocument;
				if (d && d.body) {
					var h = Math.max(d.body.scrollHeight, d.documentElement.scrollHeight);
					if (h > 300)
						frame.style.height = (h + 40) + 'px';
				}
			} catch (e) {}
		});

		return E('div', { 'class': 'cbi-map' }, [
			E('h2', { 'name': 'content' }, [ _('快速设置向导') ]),
			E('div', { 'class': 'cbi-map-descr' }, [
				_('设置路由器管理密码、上网方式，以及 Wi-Fi 名称与密码。填写后点击「完成设置」即可生效。')
			]),
			frame
		]);
	},

	handleSaveApply: null,
	handleSave: null,
	handleReset: null
});
