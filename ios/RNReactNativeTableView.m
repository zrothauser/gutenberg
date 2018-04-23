#import "RNReactNativeTableView.h"

@interface RNReactNativeTableView() <UITableViewDataSource>

@property (nonatomic, strong) NSArray *data;

@end

@implementation RNReactNativeTableView

- (instancetype)init {
    self = [super init];
    if (self) {
        [self commonInit];
    }
    return self;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
    self = [super initWithCoder:aDecoder];
    if (self) {
        [self commonInit];
    }
    return self;
}

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        [self commonInit];
    }
    return self;
}

- (instancetype)initWithFrame:(CGRect)frame style:(UITableViewStyle)style {
    self = [super initWithFrame:frame style:style];
    if (self) {
        [self commonInit];
    }
    return self;
}

- (void)commonInit {
    self.dataSource = self;
    [self setDataSize:0];
}

- (void)setDataSize:(NSInteger)size {
  NSMutableArray *generatedData = [[NSMutableArray alloc] init];
  for (int i = 0; i < size; i++) {
    [generatedData addObject:[NSString stringWithFormat:@"Item #%i", i]];
  }
  self.data = [NSArray arrayWithArray:generatedData];
  [self reloadData];
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.data.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [self dequeueReusableCellWithIdentifier:@"Cell"];
    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleValue1 reuseIdentifier:@"Cell"];
    }
    NSString *label = self.data[indexPath.row];
    cell.textLabel.text = label;
    return cell;

}

@end
