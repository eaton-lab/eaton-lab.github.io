/* start module: LD */
$pyjs['loaded_modules']['LD'] = function (__mod_name__) {
	if($pyjs['loaded_modules']['LD']['__was_initialized__']) return $pyjs['loaded_modules']['LD'];
	var $m = $pyjs['loaded_modules']['LD'];
	$m['__repr__'] = function() { return '<module: LD>'; };
	$m['__was_initialized__'] = true;
	if ((__mod_name__ === null) || (typeof __mod_name__ == 'undefined')) __mod_name__ = 'LD';
	$m['__name__'] = __mod_name__;


	$m['pygame'] = $p['___import___']('pygame', null);
	$m['sys'] = $p['___import___']('sys', null);
	$m['os'] = $p['___import___']('os', null);
	$m['random'] = $p['___import___']('random', null);
	$m['glob'] = $p['___import___']('glob', null);
	$m['Bug'] = (function(){
		var $cls_definition = new Object();
		var $method;
		$cls_definition['__module__'] = 'LD';
		$method = $pyjs__bind_method2('__init__', function(screen, imagepath) {
			if (this['__is_instance__'] === true) {
				var self = this;
			} else {
				var self = arguments[0];
				screen = arguments[1];
				imagepath = arguments[2];
			}
			var $mul7,$mul6,$or1,size,$iter2_iter,$div4,$sub3,$sub2,$mul4,$sub4,$augexpr1,$augexpr2,$iter2_type,$or2,$augsub2,$augsub1,$iter2_idx,$mul8,$div2,$div3,$mul5,$div1,$mul3,$mul2,$mul1,$iter2_nextval,img,idx,$sub1,$add2,$add3,$add1,$add6,$add7,$add4,$add5,mindim,$add8,$iter2_array;
			$m['pygame']['sprite']['Sprite']['__init__'](self);
			self['screen_width'] = screen['get_width']();
			self['screen_height'] = screen['get_height']();
			self['imagefiles'] = $m['glob']['glob'](imagepath);
			self['images'] = function(){
				var $iter1_nextval,$iter1_type,img,$collcomp1,$iter1_iter,$iter1_idx,$iter1_array;
	$collcomp1 = $p['list']();
			$iter1_iter = $p['getattr'](self, 'imagefiles');
			$iter1_nextval=$p['__iter_prepare']($iter1_iter,false);
			while (typeof($p['__wrapped_next']($iter1_nextval)['$nextval']) != 'undefined') {
				img = $iter1_nextval['$nextval'];
				$collcomp1['append']($m['pygame']['image']['load'](img));
			}

	return $collcomp1;}();
			self['image'] = $p['getattr'](self, 'images')['__getitem__'](0);
			self['frame'] = 0;
			self['speed'] = $p['list']([5, 5]);
			var $augsub1 = 0;
			var $augexpr1 = $p['getattr'](self, 'speed');
			$augexpr1['__setitem__']($augsub1, (typeof ($mul1=$augexpr1['__getitem__']($augsub1))==typeof ($mul2=$m['random']['choice']($p['list']([(typeof ($usub1=1)=='number'?
				-$usub1:
				$p['op_usub']($usub1)), 1]))) && typeof $mul1=='number'?
				$mul1*$mul2:
				$p['op_mul']($mul1,$mul2)));
			var $augsub2 = 1;
			var $augexpr2 = $p['getattr'](self, 'speed');
			$augexpr2['__setitem__']($augsub2, (typeof ($mul3=$augexpr2['__getitem__']($augsub2))==typeof ($mul4=$m['random']['choice']($p['list']([(typeof ($usub2=1)=='number'?
				-$usub2:
				$p['op_usub']($usub2)), 1]))) && typeof $mul3=='number'?
				$mul3*$mul4:
				$p['op_mul']($mul3,$mul4)));
			$iter2_iter = $p['range']($p['len']($p['getattr'](self, 'images')));
			$iter2_nextval=$p['__iter_prepare']($iter2_iter,false);
			while (typeof($p['__wrapped_next']($iter2_nextval)['$nextval']) != 'undefined') {
				idx = $iter2_nextval['$nextval'];
				img = $p['getattr'](self, 'images')['__getitem__'](idx);
				size = img['get_size']();
				mindim = 5.0;
				while ($p['bool'](($p['bool']($or1=($p['cmp'](size['__getitem__'](0), (typeof ($div1=$p['getattr'](self, 'screen_width'))==typeof ($div2=mindim) && typeof $div1=='number' && $div2 !== 0?
					$div1/$div2:
					$p['op_div']($div1,$div2))) == 1))?$or1:($p['cmp'](size['__getitem__'](1), (typeof ($div3=$p['getattr'](self, 'screen_height'))==typeof ($div4=mindim) && typeof $div3=='number' && $div4 !== 0?
					$div3/$div4:
					$p['op_div']($div3,$div4))) == 1)))) {
					img = $m['pygame']['transform']['scale'](img, $p['tuple']([$p['float_int']((typeof ($mul5=size['__getitem__'](0))==typeof ($mul6=0.5) && typeof $mul5=='number'?
						$mul5*$mul6:
						$p['op_mul']($mul5,$mul6))), $p['float_int']((typeof ($mul7=size['__getitem__'](1))==typeof ($mul8=0.5) && typeof $mul7=='number'?
						$mul7*$mul8:
						$p['op_mul']($mul7,$mul8)))]));
					size = img['get_size']();
				}
				if ($p['bool'](($p['cmp']($p['getattr'](self, 'speed')['__getitem__'](0), 0) == 1))) {
					img = $m['pygame']['transform']['flip'](img, 1, 0);
				}
				$p['getattr'](self, 'images')['__setitem__'](idx, img);
			}
			self['size'] = $p['getattr'](self, 'images')['__getitem__'](0)['get_size']();
			self['rect'] = $p['getattr'](self, 'images')['__getitem__'](0)['get_rect']();
			$p['getattr'](self, 'rect')['center'] = $p['tuple']([$m['random']['randint']($p['__op_add']($add1=$p['getattr'](self, 'size')['__getitem__'](0),$add2=50), $p['__op_sub']($sub1=$p['getattr'](self, 'screen_width'),$sub2=$p['__op_add']($add3=$p['getattr'](self, 'size')['__getitem__'](0),$add4=50))), $m['random']['randint']($p['__op_add']($add5=$p['getattr'](self, 'size')['__getitem__'](1),$add6=50), $p['__op_sub']($sub3=$p['getattr'](self, 'screen_height'),$sub4=$p['__op_add']($add7=$p['getattr'](self, 'size')['__getitem__'](1),$add8=50)))]);
			return null;
		}
	, 1, [null,null,['self'],['screen'],['imagepath']]);
		$cls_definition['__init__'] = $method;
		$method = $pyjs__bind_method2('update', function() {
			if (this['__is_instance__'] === true) {
				var self = this;
			} else {
				var self = arguments[0];
			}
			var $or5,$or4,$iter3_idx,$add14,idx,$or3,$iter3_array,$add13,$or6,$add10,$iter3_iter,$add12,$iter3_type,$add9,srect,$iter3_nextval,$add11;
			self['frame'] = $p['__op_add']($add9=$p['getattr'](self, 'frame'),$add10=1);
			if ($p['bool'](($p['cmp']($p['getattr'](self, 'frame'), 3) == 1))) {
				self['frame'] = 0;
			}
			self['image'] = $p['getattr'](self, 'images')['__getitem__']($p['getattr'](self, 'frame'));
			srect = $p['getattr'](self, 'rect');
			if ($p['bool'](($p['bool']($or3=($p['cmp']($p['getattr'](srect, 'left'), 0) == -1))?$or3:($p['cmp']($p['getattr'](srect, 'right'), $p['getattr'](self, 'screen_width')) == 1)))) {
				$p['getattr'](self, 'speed')['__setitem__'](0, (typeof ($usub3=$p['getattr'](self, 'speed')['__getitem__'](0))=='number'?
					-$usub3:
					$p['op_usub']($usub3)));
				$iter3_iter = $p['range']($p['len']($p['getattr'](self, 'images')));
				$iter3_nextval=$p['__iter_prepare']($iter3_iter,false);
				while (typeof($p['__wrapped_next']($iter3_nextval)['$nextval']) != 'undefined') {
					idx = $iter3_nextval['$nextval'];
					$p['getattr'](self, 'images')['__setitem__'](idx, $m['pygame']['transform']['flip']($p['getattr'](self, 'images')['__getitem__'](idx), 1, 0));
				}
			}
			if ($p['bool'](($p['bool']($or5=($p['cmp']($p['getattr'](srect, 'top'), 0) == -1))?$or5:($p['cmp']($p['getattr'](srect, 'bottom'), $p['getattr'](self, 'screen_height')) == 1)))) {
				$p['getattr'](self, 'speed')['__setitem__'](1, (typeof ($usub4=$p['getattr'](self, 'speed')['__getitem__'](1))=='number'?
					-$usub4:
					$p['op_usub']($usub4)));
			}
			$p['getattr'](self, 'rect')['x'] = $p['__op_add']($add11=$p['getattr']($p['getattr'](self, 'rect'), 'x'),$add12=$p['getattr'](self, 'speed')['__getitem__'](0));
			$p['getattr'](self, 'rect')['y'] = $p['__op_add']($add13=$p['getattr']($p['getattr'](self, 'rect'), 'y'),$add14=$p['getattr'](self, 'speed')['__getitem__'](1));
			return null;
		}
	, 1, [null,null,['self']]);
		$cls_definition['update'] = $method;
		var $bases = new Array($p['getattr']($p['getattr']($m['pygame'], 'sprite'), 'Sprite'));
		var $data = $p['dict']();
		for (var $item in $cls_definition) { $data['__setitem__']($item, $cls_definition[$item]); }
		return $p['_create_class']('Bug', $p['tuple']($bases), $data);
	})();
	$m['gen_sprites'] = function(nsprites, screen, theta) {
		var $iter4_idx,sprite,idx,$iter4_nextval,$iter4_type,$iter4_array,$iter4_iter,Sprites;
		Sprites = $m['pygame']['sprite']['Group']();
		$iter4_iter = $p['range'](nsprites);
		$iter4_nextval=$p['__iter_prepare']($iter4_iter,false);
		while (typeof($p['__wrapped_next']($iter4_nextval)['$nextval']) != 'undefined') {
			idx = $iter4_nextval['$nextval'];
			sprite = $pyjs_kwargs_call(null, $m['Bug'], null, null, [{'imagepath':$m['os']['path']['join']('images', 'LD-*.png')}, screen]);
			Sprites['add'](sprite);
		}
		return Sprites;
	};
	$m['gen_sprites']['__name__'] = 'gen_sprites';

	$m['gen_sprites']['__bind_type__'] = 0;
	$m['gen_sprites']['__args__'] = [null,null,['nsprites'],['screen'],['theta']];
	$m['run_game'] = function(nsprites, height, width, theta) {
		if (typeof height == 'undefined') height=arguments['callee']['__args__'][3][1];
		if (typeof width == 'undefined') width=arguments['callee']['__args__'][4][1];
		if (typeof theta == 'undefined') theta=arguments['callee']['__args__'][5][1];
		var $iter5_nextval,$iter6_type,$iter5_idx,ani,$iter5_iter,$iter5_type,$iter6_iter,event,$iter6_nextval,clock,bgcolor,exit,fps,$iter5_array,start,$sub5,$or7,$iter6_idx,screen,$or8,cols,$iter6_array,background,pup,Sprites,$sub6;
		bgcolor = $p['tuple']([70, 50, 50]);
		fps = 30;
		ani = 4;
		clock = $m['pygame']['time']['Clock']();
		start = $m['pygame']['time']['get_ticks']();
		screen = $m['pygame']['display']['set_mode']($p['tuple']([width, height]));
		background = $m['pygame']['Surface'](screen['get_size']());
		background = background['convert']();
		background['fill'](bgcolor);
		screen['blit'](background, $p['tuple']([0, 0]));
		Sprites = $m['gen_sprites'](nsprites, screen, theta);
		exit = false;
		while ($p['bool'](1)) {
			$iter5_iter = $m['pygame']['event']['get']();
			$iter5_nextval=$p['__iter_prepare']($iter5_iter,false);
			while (typeof($p['__wrapped_next']($iter5_nextval)['$nextval']) != 'undefined') {
				event = $iter5_nextval['$nextval'];
				if ($p['bool']($p['op_eq']($p['getattr'](event, 'type'), $p['getattr']($m['pygame'], 'QUIT')))) {
					exit = true;
				}
				if ($p['bool']($p['op_eq']($p['getattr'](event, 'type'), $p['getattr']($m['pygame'], 'KEYDOWN')))) {
					if ($p['bool']($p['list']([$p['ord']('q')])['__contains__']($p['getattr'](event, 'key')))) {
						exit = true;
					}
				}
			}
			Sprites['clear'](screen, background);
			Sprites['update']();
			Sprites['draw'](screen);
			$iter6_iter = Sprites;
			$iter6_nextval=$p['__iter_prepare']($iter6_iter,false);
			while (typeof($p['__wrapped_next']($iter6_nextval)['$nextval']) != 'undefined') {
				pup = $iter6_nextval['$nextval'];
				cols = $m['pygame']['sprite']['spritecollide'](pup, Sprites, false);
				if ($p['bool'](($p['cmp']($p['len'](cols), 1) == 1))) {
					cols['__getitem__'](0)['kill']();
				}
			}
			$m['pygame']['display']['flip']();
			clock['tick'](fps);
			if ($p['bool'](!$p['op_eq'](nsprites, $p['len'](Sprites)))) {
				nsprites = $p['len'](Sprites);
				$p['printFunc'](['[{} Pups] @ {}'['format']($p['len'](Sprites), $p['__op_sub']($sub5=$m['pygame']['time']['get_ticks'](),$sub6=start))], 1);
			}
			if ($p['bool'](($p['bool']($or7=$p['op_eq']($p['len'](Sprites), 1))?$or7:exit))) {
				break;
			}
		}
		$m['pygame']['quit']();
		return null;
	};
	$m['run_game']['__name__'] = 'run_game';

	$m['run_game']['__bind_type__'] = 0;
	$m['run_game']['__args__'] = [null,null,['nsprites'],['height', 600],['width', 600],['theta', 1]];
	if ($p['bool']($p['op_eq']((typeof __name__ == "undefined"?$m['__name__']:__name__), '__main__'))) {
		$pyjs_kwargs_call(null, $m['run_game'], null, null, [{'nsprites':6, 'height':800, 'width':800}]);
	}
	return this;
}; /* end LD */


/* end module: LD */


/*
PYJS_DEPS: ['pygame', 'sys', 'os', 'random', 'glob']
*/
