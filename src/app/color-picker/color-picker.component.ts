
declare function require(name : string);
import {
    AfterViewInit, ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    Renderer2,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
var colorCovert = require('color-convert');

@Component({
  selector: 'color-picker',
  templateUrl: `color-picker.component.html`,
  styleUrls: ['color-picker.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ColorPickerComponent implements  AfterViewInit{
    
    @Input() public pointerColor = '#ff0000';
    public newColor = '';
    public localScope = {mode : {0 : ['H', 'S', 'V'] , 1 : ['R', 'G', 'B']},  baseColor : ''} ;
    public rainbowPointerTop = '0';
    public colorPickerPointerTop = '0';
    public colorPickerPointerLeft = '0';
    public rainbowPointerLeft = '0';

    @Input() public width = '400px';
    @Input() public height = '200px';
    @Input() public widgetVisibility = true;
    
    
    @Output() colorChanged = new EventEmitter<number>();
    
    @ViewChild('colorPickerPointer') public colorPickerPointer : ElementRef;
    @ViewChild('rainbowPointer') public rainbowPointer: ElementRef;
    @ViewChild('pickerField') public pickerField : ElementRef;
    @ViewChild('rainbowField') public rainbowField : ElementRef;
    
    public textColorGroup = new FormGroup({
        firstField: new FormControl(),
        secondField: new FormControl(),
        thirdField: new FormControl(),
    });
    
    constructor(private renderer : Renderer2, public changeRef : ChangeDetectorRef){
        this.textColorGroup.valueChanges.subscribe((change)=>{
/*             console.log(colorCovert.hsv.hex(colorCovert.hex.hsv(this.pointerColor)[0], 100, 100)) ;
             console.log(colorCovert.hex.hsv(this.pointerColor));*/
        })
    }
    
    ngAfterViewInit(){
        setTimeout(()=>{
            this.setBaseColor();
            this.setPointerPosition();
        }, 0)
    }
    
    setPointerPosition(){//установка позиции курсора основного поля
        let hsv = colorCovert.hex.hsv(this.pointerColor);
        this.rainbowPointerTop = (hsv[0]/360 * this.rainbowField.nativeElement.clientHeight) +'px';//установка позиции курсора rainbowField
        //установка позиции курсора pickerField
        this.colorPickerPointerLeft = (hsv[1]/100 * this.pickerField.nativeElement.clientWidth -5)+'px';
        this.colorPickerPointerTop = ((this.pickerField.nativeElement.clientHeight - hsv[2]/100 * this.pickerField.nativeElement.clientHeight) -5) + 'px' ;
        this.setFormControls();
        
    }
    
    setBaseColor(){ //установка базового цвета при старте из первоначального, переданного пользователем значения цвета pointerColor
        this.localScope.baseColor = '#'+colorCovert.hsv.hex(colorCovert.hex.hsv(this.pointerColor)[0], 100, 100) ;
        this.newColor = this.pointerColor;
    }
    
    onMouseDownPickerField(data){
        let that = this;
        console.log(data);
        if(data.event && data.event.button == 0 ){
            document.addEventListener('mouseup', mouseUpListener);
            document.addEventListener('mousemove',moveListener);
            moveListener(data.event)
        }

        
        function mouseUpListener(){
            console.log('removed');
            document.removeEventListener('mouseup', mouseUpListener);
            document.removeEventListener('mousemove', moveListener);
            data = undefined;
    
        }
        
        function moveListener(event){
            if(!data) return;
            let rainbow = data.pointer.className.indexOf('rainbow') >= 0,
                boundingRect =  data.pointerField.getBoundingClientRect(),
                left = event.clientX - boundingRect.left ,
                top = event.clientY - boundingRect.top ,
                topVar = (top < 0 ? 0 : top > data.pointerField.clientHeight ? data.pointerField.clientHeight : top) + (rainbow ? 0 : -5)+'px',
            leftVar = (left < 0 || rainbow  ? 0 : left > data.pointerField.clientWidth ? data.pointerField.clientWidth : left) + (rainbow ? 0 : -5)+'px';
            if(rainbow){//движение указателей
                that.rainbowPointerLeft = leftVar;
                that.rainbowPointerTop = topVar;
                that.changeRef.detectChanges();
                setBaseColorField();
            }
            else{
                that.colorPickerPointerTop = topVar;
                that.colorPickerPointerLeft = leftVar;
            }
            that.setFormControls();
        }
        
        function setBaseColorField() { //установка базового цвета из положения курсора на rainbowField,
            // пересчет цифровых значений цвета
           that.localScope.baseColor = '#'+colorCovert.hsv.hex((parseInt(window.getComputedStyle(data.pointer).top)/ data.pointerField.clientHeight) * 360, 100, 100);
    
        }
        
    }
    
    setFormControls() {
        let hsv = {h : Math.round(parseInt(this.rainbowPointerTop)/this.rainbowField.nativeElement.clientHeight * 360), s : Math.round((parseInt(this.colorPickerPointerLeft) + 5)/this.pickerField.nativeElement.clientWidth * 100), v : Math.round(100 - ((parseInt(this.colorPickerPointerTop ) + 5)/this.pickerField.nativeElement.clientHeight * 100))};
        this.textColorGroup.setValue({firstField : hsv.h, secondField : hsv.s, thirdField : hsv.v});
        this.newColor = '#'+colorCovert.hsv.hex(hsv.h, hsv.s, hsv.v);
    }
    
    onClickReadyButton(start){
        !start && (this.pointerColor = this.newColor);
        this.widgetVisibility = !this.widgetVisibility ;
        this.changeRef.detectChanges();
    }
    onContextMenu(event){
         event.preventDefault() ;
         console.log(6);
    }
    
    handleClick() {
        this.colorChanged.emit(1);
    }
    

}
