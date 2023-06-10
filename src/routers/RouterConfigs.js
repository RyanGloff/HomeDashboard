const RouterConfigs = {
    "controller": {
        plural: "controllers"
    },
    "host": {
        plural: "hosts",
        collections: {
            "controllers": {
                foreignType: "controller",
                localKey: "id",
                fkey: "hostId",
                readOnly: true  // TODO: Implement posting to parent for ManyToMany relationships
            }
        }
    },
    "pending-action": {
        plural: "pending-actions",
        "removedEndpoints": [ "PATCH", "PUT" ]
    }
}

export default RouterConfigs;