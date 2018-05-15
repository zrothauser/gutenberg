import Foundation
import UIKit

@objc class RecyclerListView: UIView {

    fileprivate var data = [RecyclerListItemView]()

    let cellIdentifier = "RecycleCell"
    
    lazy var tableView: UITableView = {
        return UITableView(frame: self.frame, style: .plain)
    }()
    
    @objc override init(frame: CGRect) {
        super.init(frame: frame)
        commonInit()
    }
    
    @objc required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        commonInit()
    }
    
    func commonInit() {
        tableView.dataSource = self
        tableView.register(WrapperCell.self, forCellReuseIdentifier: cellIdentifier)
        tableView.rowHeight = UITableViewAutomaticDimension
        tableView.estimatedRowHeight = 80
        addSubview(tableView)        
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        tableView.frame = bounds
    }

    override func addSubview(_ view: UIView) {
        // if we are adding another thing let's ignore it
        guard let listItem = view as? RecyclerListItemView else {
            super.addSubview(view)
            return
        }
        // only add it if we don't have an item already
        if let item = data.first(where: { $0.itemKey == listItem.itemKey}) {
            print("Found cell with index: \(listItem.itemIndex) and key: \(listItem.itemKey)")
            if let cell = tableView.cellForRow(at: IndexPath(row: item.itemIndex, section: 0)) as? WrapperCell {
                    cell.listItemView = listItem
                    data[item.itemIndex] = listItem
                    print("Update cell with index: \(listItem.itemIndex)")
            }
        } else {
            print("Add cell with index: \(listItem.itemIndex) and key: \(listItem.itemKey)")

            data.insert(listItem, at: listItem.itemIndex)
            let newIndexPaths = [IndexPath(row:listItem.itemIndex, section: 0)]
            tableView.insertRows(at: newIndexPaths , with: .automatic)
            let deadlineTime: DispatchTime = DispatchTime.now() + .milliseconds(250)
            DispatchQueue.main.asyncAfter(deadline: deadlineTime) {
                self.tableView.beginUpdates()
                self.tableView.endUpdates()
            }
        }
    }
}

extension RecyclerListView: UITableViewDataSource {

    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return data.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: cellIdentifier, for: indexPath) as! WrapperCell
        let view = data[indexPath.row]
        cell.listItemView = view
        return cell
    }
}

extension RecyclerListView {

    @objc var dataSize: Int {
        set {
            data.removeAll()
            tableView.reloadData()
        }

        get {
            return data.count
        }
    }

    @objc func scroll(to: Int, animated: Bool) {
        let position = max(min(to, data.count-1),0)
        tableView.scrollToRow(at: IndexPath(row: position, section: 0), at: .top, animated: animated)
    }

    @objc func moveCell(from: Int, to: Int) {
        data.swapAt(from, to)
        tableView.moveRow(at: IndexPath(row: from, section: 0), to: IndexPath(row: to, section: 0))
    }

    func makeIndexPaths(from: Int, count: Int) -> [IndexPath] {
        var indices = [IndexPath]()
        for i in 0..<count {
            indices.append(IndexPath(row: from + i, section:0))
        }
        return indices
    }

    @objc func insertItems(at: Int, amount:Int) {
        // we don't need to do anything here, the addition of subviews to the react tree to the view will trigger the inserts automattically
    }

    @objc func removeItems(at: Int, amount:Int) {
        tableView.beginUpdates()
        let indices: [IndexPath] = makeIndexPaths(from: at, count: amount)

        tableView.deleteRows(at: indices, with: .automatic)
        data.removeSubrange(at..<at+amount)
        tableView.endUpdates()
    }
}

class WrapperCell: UITableViewCell {

    var listItemView: RecyclerListItemView? {
        didSet {
            if let item = listItemView {
                update(with: item)
            }
        }
    }

    override init(style: UITableViewCellStyle, reuseIdentifier: String?) {
        super.init(style: .default, reuseIdentifier: reuseIdentifier)
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }


    override var intrinsicContentSize: CGSize {
        return listItemView!.intrinsicContentSize
    }

    func update(with listItem: RecyclerListItemView) {
        //search in cell for another list item
        while !contentView.subviews.isEmpty {
            contentView.subviews[0].removeFromSuperview()
        }

        contentView.addSubview(listItem)
        NSLayoutConstraint.activate([
            listItem.leftAnchor.constraint(equalTo: contentView.leftAnchor),
            listItem.rightAnchor.constraint(lessThanOrEqualTo: contentView.rightAnchor),
            listItem.topAnchor.constraint(equalTo: contentView.topAnchor),
            listItem.bottomAnchor.constraint(equalTo: contentView.bottomAnchor)
            ])
    }
}
