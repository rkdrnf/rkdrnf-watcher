# rkdrnf-watcher
This library provides base class for watching properties inside.


# Usage
`class Component` offers `watch()` and `step()` method to watch it's own property and represent single step of tracking.
By calling step() repetitively according to any refresh cycle you intended, you can mimick variable tracking feature in those UI Framework such as React or Angular

# API
### ```watch(propName, callback)``` 
### ```step()```

# Example
```
class MyComponent extends Component {
    ...
    constructor() {
        super();
        this.clickCount = 0;
        this.watch("clickCount", (prop, changes) => {
            console.log(`${prop} old: ${changes.old}, new: ${changes.val}`);
        });
    }
    
    onClickUI() {
        this.clickCount++;
    }

    onEachFrame() {
        this.step();
    }
}
```

# Test
`$ npm test`

